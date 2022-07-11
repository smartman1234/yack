import { Controller, Get, Post as HTTPPost, Put, Delete, Req, HttpCode, Body, Param, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express'
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostsService } from '../posts/posts.service';
import { CommentsService } from '../comments/comments.service';
import { FileInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express'
import { UseInterceptors, UploadedFiles, UploadedFile } from '@nestjs/common'
import { IPost } from 'src/types/IPost';
import { getValueFromMailHeaders } from '../helpers'
import { Inbox } from 'src/inboxes/inbox.entity';
import { InboxesService } from 'src/inboxes/inboxes.service';
import { EventsService } from '../events/events.service';
import { NEW_POST, NEW_COMMENT, STATUSES } from '../constants'
import { Post } from 'src/posts/post.entity';
import { IComment } from 'src/types/IComment';
import { IEvent } from '../types/IEvent';
import * as cheerio from 'cheerio';
import { generateUniqueMessageId } from 'src/util';
import { PostLabelsService } from 'src/post-labels/post-labels.service';
import { IPostLabel } from 'src/types/IPostLabel';
import { ILabel } from 'src/types/ILabel';
import * as moment from 'moment';
import { identity } from 'rxjs';
import { send, setApiKey } from '@sendgrid/mail';
import { AccountUsersService } from 'src/account-users/account-users.service';
import { User } from 'src/users/user.entity';
import { AccountsService } from 'src/accounts/accounts.service';
import { Account } from 'src/accounts/account.entity';
import { AccountUser } from 'src/account-users/account-user.entity';
import { STRIPE_REDIRECT_LOCAL, STRIPE_REDIRECT_LIVE, API_LIVE, API_LOCAL } from '../constants'
import * as AWS from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid'
import { diskStorage } from 'multer'
import * as path from 'path'
import * as fs from 'fs'

const uploadFile = (file: any) => {
  return new Promise((resolve: any, reject: any) => {
      const Expires = 60 * 60
      const Bucket = process.env.AWS_S3_BUCKET
      const accessKeyId = process.env.AWS_S3_ACCESS_KEY_ID
      const secretAccessKey = process.env.AWS_S3_SECRET_ACCESS_KEY
      const endpoint = new AWS.Endpoint(process.env.AWS_S3_ENDPOINT)

      // Authenticate with DO
      const s3 = new AWS.S3({
        s3BucketEndpoint: true,
        endpoint,
        accessKeyId,
        secretAccessKey,
      })

      // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
      const filePath = file.path;
      const name = path.basename(filePath)
      const filenameParts = name.split('.');
      const Key = moment().format('DD-MM-YYYY') + "/" + file.filename;
      const Body = fs.createReadStream(filePath);

      // Create the S3 config values (10 MB)
      const partSize = 10 * 1024 * 1024;
      const queueSize = 10;
      const options = { partSize, queueSize };
      const mime = file.mimetype
      const { size } = fs.statSync(filePath)
      const params = {
        Bucket,
        Key,
        Body,
        ContentType: mime,
        ACL: 'public-read',
        CORSConfiguration: {
          CORSRules: [{
            AllowedHeaders: ['*'],
            AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
            AllowedOrigins: ['*'],
            MaxAgeSeconds: 3000
          }]
        }
      };

      s3.upload(params, options, (err, data) => {
        if (!err) {
          // If it's not an image, we will delete it
          // The image processing process will delete it if it's an image
          fs.unlink(filePath, err => {
            if (err) throw err
          })

          // Send back
          resolve({
            filename: file.originalname,
            type: file.mimetype,
            url: data.Location
          })
        } else {
          reject(err)
        }
      })
  })
}

@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly postLabelsService: PostLabelsService,
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
    private readonly inboxesService: InboxesService,
    private readonly accountUsersService: AccountUsersService,
    private readonly accountsService: AccountsService,
  ) {
    setApiKey(process.env.SENDGRID_API_KEY);
  }

  // --------------------------------------------------------------------------------
  // SENDGRID PARSE -----------------------------------------------------------------
  // --------------------------------------------------------------------------------

  // This is the main webhook for SendGrid
  @HTTPPost()
  @UseInterceptors(AnyFilesInterceptor({
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        // Generating a 32 random chars long string
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')

        //Calling the callback passing the random name generated with the original extension name
        cb(null, `${randomName}${path.extname(file.originalname)}`)
      }
    })
  }))
  async webhookPost(@UploadedFiles() files, @Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const {
        headers,
        dkim,
        to,
        html,
        from,
        text,
        sender_ip,
        envelope,
        //attachments,
        subject,
        charsets,
        SPF,
      } = req.body;
      const { host } = req.headers;

      // Set up basic variables
      const regExp = /\<([^)]+)\>/;
      const status: string = STATUSES.OPEN;
      let attachments: any[] = null

      // For reference:
      // const { fieldname, originalname, encoding, destination, filename, path, mimetype } = file
      if (files) {
        if (files.length != 0) {
          attachments = await Promise.all(files.map((file: any) => uploadFile(file)))
        }
      }

      console.log('NEW SENDGRID PARSE CALL: FILES -> ', attachments)

      // const toAndFromFields = JSON.parse(envelope)
      // const subject = getValueFromMailHeaders(headers, "Subject");
      // const to = getValueFromMailHeaders(headers, "To");
      // const from = getValueFromMailHeaders(headers, "From");
      // Compile the HTML
      const $ = cheerio.load(html);

      // Remove unnessary stuff
      $('blockquote').remove();
      $('.gmail_quote').remove();
      $('.gmail_signature').remove();

      const htmlOfPage = $.html()
      let formattedDescription = htmlOfPage.replace(/<\/?[^>]+(>|$)/g, "").trim();
      const last2characters = formattedDescription.slice(-2);

      // GMAIL signature
      if (last2characters == "--") formattedDescription = formattedDescription.substring(0, formattedDescription.length - 2);

      // Process othe rdetails
      const messageIdRaw = getValueFromMailHeaders(headers, "Message-ID");
      const inReplyTo = getValueFromMailHeaders(headers, "In-Reply-To");
      const references = getValueFromMailHeaders(headers, "References");
      const inboxSlug = to.split("@")[0];
      const email = from.match(regExp)[1];
      const name = from.split("<")[0].trim()
      const messageId = messageIdRaw.match(regExp)[1];

      // Find the right inbox
      const inbox: Inbox = await this.inboxesService.findOneWithSlug(inboxSlug);

      console.log('FOUND INBOX')

      // Whoops - wrong slug / not found
      if (!inbox) return res.status(200).send({ success: false });
      if (!inbox.active) return res.status(200).send({ success: false });

      console.log('CHECKED FOR ACTIVE INBOX')

      // Get the account details
      const accountId: number = inbox.account.id;
      const account: Account = await this.accountsService.findOne(accountId);
      const accountUsers: AccountUser[] = await this.accountUsersService.findAllUsers(account);
      const users: User[] = accountUsers.map((accountUser: AccountUser) => accountUser.user);

      // Send the email
      users.map((user: User) => {
        this.sendNewPostEmail(user.email, inbox.name);
      });

      // Destination is where to the send the websocket update to
      const destination: string = "account"+accountId;

      console.log('FOUND DESTINATION', destination, (!!references && !!inReplyTo))

      // COMMENT
      // If thee are references & inReply to then it's a comment
      if (!!references && !!inReplyTo) {
        console.log('SENDING A COMMENT')

        // First reference is the original POST messageId
        const firstReference: string = references.split(" ")[0];

        console.log('1. ', firstReference)

        // We need to strip the <xxx>
        const postMessageId:string = firstReference.match(regExp)[1];

        console.log('2. ', postMessageId)

        // Find the post using this messageId
        const post: Post = await this.postsService.findOneWithMessageId(postMessageId);

        console.log('3. ', post)

        // If this isn't found then do nothing
        if (post) {
          console.log('4.')

          // And now crreate the new comment with the post
          const newComment: IComment = <IComment>{
            description: formattedDescription,
            text,
            html,
            unread: true,
            post,
            messageId,
            name,
            email,
            attachments: attachments ? JSON.stringify(attachments) : null,
          }

          console.log('5. ', newComment)

          // console.log(postMessageId)
          // console.log('NEW COMMENT', newComment);
          // MArk post as unread
          await this.postsService.update(<Partial<Post>>{
            id: post.id,
            unread: true,
            latestMessageId: messageId,
          });

          console.log('6. ')

          // And then in the DB
          const comment = await this.commentsService.create(newComment);

          console.log('7. ', comment)

          // Create our payload
          const payload = comment;
          const commentEvent = <IEvent>{
            type: NEW_COMMENT,
            destination,
            payload,
          }

          // Debug
          console.log('SENDING COMMENT EVENT', commentEvent)

          // Now tell the websocket connection to send it to the frontend
          EventsService.getInstance().send(commentEvent);
        }
      }

      // POST
      // Then this is a new POST
      if (!references && !inReplyTo) {
        console.log('SENDING A POST')

        const newPost: IPost = <IPost>{
          status,
          title: subject,
          description: formattedDescription,
          text,
          html,
          ip: sender_ip,
          email,
          name,
          messageId,
          latestMessageId: messageId,
          inbox,
          unread: true,
          attachments: attachments ? JSON.stringify(attachments) : null,
        }

        // console.log('NEW POST', newPost);
        // And then in the DB
        const post = await this.postsService.create(newPost);
        const payload = {
          ...post,
          post_labels: [],
          labels: [],
        };
        const postEvent = <IEvent>{
          type: NEW_POST,
          destination,
          payload,
        }

        // Debug
        console.log('SENDING POST EVENT', postEvent)

        // Now tell the websocket connection to send it to the frontend
        EventsService.getInstance().send(postEvent);
      }

      console.log('RETURN')
      res.status(200).send({ success: true })
    } catch(error) {
      console.log(error)
      res.status(500).send({ error: true })
    }
  }

  // --------------------------------------------------------------------------------
  // WIDGET -------------------------------------------------------------------------
  // --------------------------------------------------------------------------------

  // Serves the widget the inbox details to use
  @Get('widget/:slug')
  async widgetSlugGet(@Param('slug') slug, @Req() request: Request): Promise<any> {
    try {
      return await this.inboxesService.findOneWithSlugForWidget(slug)
    } catch(error) {
      throw(error)
    }
  }

  // Handles the post creation from widget
  @HTTPPost('widget/:slug')
  async widgetSlugPost(@Param('slug') slug, @Body() values: any, @Req() request: Request): Promise<any> {
    try {
      const { comment, title, name, email, label, attachments, agent, browser, fields } = values;
      const labelId = Number(label.id);
      const labelText = label.text;
      const status: string = STATUSES.OPEN;
      const inbox: Inbox = await this.inboxesService.findOneWithSlug(slug);
      const messageId = generateUniqueMessageId();
      const accountId: number = inbox.account.id;
      const destination: string = "account"+accountId;
      const newPost: IPost = <IPost>{
        status,
        title,
        attachments,
        description: comment,
        text: comment,
        html: comment,
        ip: '',
        email,
        name,
        agent,
        browser,
        messageId,
        latestMessageId: messageId,
        inbox,
        unread: true,
        fields,
      }

      // Debug
      console.log(newPost, destination);

      // Get the account details
      const account: Account = await this.accountsService.findOne(accountId);
      const accountUsers: AccountUser[] = await this.accountUsersService.findAllUsers(account);
      const users: User[] = accountUsers.map((accountUser: AccountUser) => accountUser.user);

      // Send the email
      users.map((user: User) => {
        this.sendNewPostEmail(user.email, inbox.name);
      });

      // console.log('NEW POST', newPost);
      // And then in the DB
      const post = await this.postsService.create(newPost);
      const postLabel = await this.postLabelsService.create(<IPostLabel>{
        post: <IPost>{ id: post.id },
        label: <ILabel>{ id: labelId },
      })

      // Create this for the frontend
      // fromWidget is important here
      const payload = {
        ...post,
        labels: [labelText],
        post_labels: [postLabel]
      };

      // Now tell the websocket connection to send it to the frontend
      EventsService.getInstance().send({
        type: NEW_POST,
        destination,
        payload,
      });

      return true;
    } catch(error) {
      console.log(error)
      throw(error)
    }
  }

  // Handles the file uploads
  @HTTPPost('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        // Generating a 32 random chars long string
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')

        //Calling the callback passing the random name generated with the original extension name
        cb(null, `${randomName}${path.extname(file.originalname)}`)
      }
    })
  }))
  widgetUploadUrl(@UploadedFile() file, @Res() res: Response) {
    const Expires = 60 * 60
    const Bucket = process.env.AWS_S3_BUCKET
    const accessKeyId = process.env.AWS_S3_ACCESS_KEY_ID
    const secretAccessKey = process.env.AWS_S3_SECRET_ACCESS_KEY
    const endpoint = new AWS.Endpoint(process.env.AWS_S3_ENDPOINT)

    // Authenticate with DO
    const s3 = new AWS.S3({
      s3BucketEndpoint: true,
      endpoint,
      accessKeyId,
      secretAccessKey,
    })

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    const filePath = file.path;
    const name = path.basename(filePath)
    const filenameParts = name.split('.');
    const Key = moment().format('DD-MM-YYYY') + "/" + file.filename;
    const Body = fs.createReadStream(filePath);

    // Create the S3 config values (10 MB)
    const partSize = 10 * 1024 * 1024;
    const queueSize = 10;
    const options = { partSize, queueSize };
    const mime = file.mimetype
    const { size } = fs.statSync(filePath)
    const params = {
      Bucket,
      Key,
      Body,
      ContentType: mime,
      ACL: 'public-read',
      CORSConfiguration: {
        CORSRules: [{
          AllowedHeaders: ['*'],
          AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
          AllowedOrigins: ['*'],
          MaxAgeSeconds: 3000
        }]
      }
    };

    s3.upload(params, options, (err, data) => {
      if (!err) {
        // Tell the widget
        res.send({ url: data.Location })

        // If it's not an image, we will delete it
        // The image processing process will delete it if it's an image
        fs.unlink(filePath, err => {
          if (err) throw err
        })
      } else {
        res.status(500).send({ message: 'Failed' })
      }
    })
  }

  // --------------------------------------------------------------------------------
  // STRIPE -------------------------------------------------------------------------
  // --------------------------------------------------------------------------------

  // 1.
  // This generates the Checkout URL
  // Happens when someone goes premium
  @HTTPPost('subscription/create_session')
  async subscriptionCreateSession(@Body() values: any): Promise<any> {
    try {
      const stripe = require('stripe')(process.env.STRIPE_API_KEY);
      const { priceId, slug } = values;
      const inbox: Inbox = await this.inboxesService.findOneWithSlug(slug);
      const cancel_url: string = process.env.NODE_ENV == "dev" ? STRIPE_REDIRECT_LOCAL : STRIPE_REDIRECT_LIVE;
      const api_path: string = process.env.NODE_ENV == "dev" ? API_LOCAL : API_LIVE;

      // Create a MUTABLE session
      let sessionObject: any = {
        mode: "subscription",
        payment_method_types: ["card"],
        metadata: { slug },
        subscription_data: {
          metadata: { slug }
        },
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: api_path + '/webhook/subscription/success/{CHECKOUT_SESSION_ID}',
        cancel_url
      }

      // If they are a customer, the use their customer ID
      if (inbox.customer) sessionObject.customer = inbox.customer;

      // This will create a session for a cusotmer if they exist
      const session = await stripe.checkout.sessions.create(sessionObject);

      // Return this to the frontend
      return { sessionId: session.id };
    } catch(error) {
      console.log(error)
      throw(error)
    }
  }

  // 2.
  // Happens after they complete a subscvription Checkout
  @Get('subscription/success/:sessionId')
  async subscriptionSuccessSlug(@Param('sessionId') sessionId, @Res() res: Response): Promise<any> {
    try {
      const url: string = process.env.NODE_ENV == "dev" ? STRIPE_REDIRECT_LOCAL : STRIPE_REDIRECT_LIVE;
      const statusCode: number = 200;
      const stripe = require('stripe')(process.env.STRIPE_API_KEY);
      const { metadata: { slug } } = await stripe.checkout.sessions.retrieve(sessionId);
      const inbox: Inbox = await this.inboxesService.findOneWithSlug(slug);

      // Kind of a failsafe really
      // But these should be getting set via the webhooks
      await this.inboxesService.update(<Partial<Inbox>>{
        id: inbox.id,
        active: true,
      });

      // Redirect them to the right place
      return res.redirect(url);
    } catch(error) {
      console.log(error)
      throw(error)
    }
  }

  // 3.
  // STRIPE WEEBHOOK URLs
  // Gets called after above 2
  @HTTPPost('subscription')
  async subscriptionPost(@Body() values: any, @Req() request: Request): Promise<any> {
    try {
      const { type, data: { object } } = values;

      switch (type) {
        case "customer.subscription.created":
          this.createCustomerSubscription(object);
          break;
        case "customer.subscription.updated":
          this.updateCustomerSubscription(object);
          break;
        case "customer.subscription.deleted":
          this.deleteCustomerSubscription(object);
          break;
      }

      // Debug
      console.log(type)

      return true;
    } catch(error) {
      console.log(error)
      throw(error)
    }
  }

  // customer.subscription.created
  async createCustomerSubscription(payload: any) {
    const stripe = require('stripe')(process.env.STRIPE_API_KEY);
    const { id, current_period_start, current_period_end, customer } = payload;
    const start = moment.unix(current_period_start).toDate();
    const end = moment.unix(current_period_end).toDate();
    const { metadata: { slug } } = await stripe.subscriptions.retrieve(id);

    if (!slug) throw(`createCustomerSubscription: NO SLUG META DATA ON SUBSCRIPTION: ${id} / CUSTOMER ${customer}`)

    const inbox: Inbox = await this.inboxesService.findOneWithSlug(slug);

    await this.inboxesService.update(<Partial<Inbox>>{
      id: inbox.id,
      current_period_start: start,
      current_period_end: end,
      active: true,
      customer,
      subscription: id,
    });
  }

  // customer.subscription.updated
  async updateCustomerSubscription(payload: any) {
    const stripe = require('stripe')(process.env.STRIPE_API_KEY);
    const { id, current_period_start, current_period_end, customer } = payload;
    const start = moment.unix(current_period_start).toDate();
    const end = moment.unix(current_period_end).toDate();
    const { metadata: { slug } } = await stripe.subscriptions.retrieve(id);

    if (!slug) throw(`updateCustomerSubscription: NO SLUG META DATA ON SUBSCRIPTION: ${id} / CUSTOMER ${customer}`)

    const inbox: Inbox = await this.inboxesService.findOneWithSlug(slug);

    await this.inboxesService.update(<Partial<Inbox>>{
      id: inbox.id,
      current_period_start: start,
      current_period_end: end,
      active: true,
      customer,
      subscription: id,
    });
  }

  // customer.subscription.deleted
  async deleteCustomerSubscription(payload: any) {
    const stripe = require('stripe')(process.env.STRIPE_API_KEY);
    const { id, customer } = payload;
    const { metadata: { slug } } = await stripe.subscriptions.retrieve(id);

    if (!slug) throw(`deleteCustomerSubscription: NO SLUG META DATA ON SUBSCRIPTION: ${id} / CUSTOMER ${customer}`)

    const inbox: Inbox = await this.inboxesService.findOneWithSlug(slug);

    await this.inboxesService.update(<Partial<Inbox>>{
      id: inbox.id,
      active: false,
      subscription: null,
      customer,
    });
  }

  // Utility function
  async sendNewPostEmail(email: string, inbox: string) {
    await send({
      to: email,
      from: 'support@yack.app',
      text: 'template',
      html: 'template',
      templateId: 'd-a3d2524e6593418a8a2513418ee28c6b',
      dynamicTemplateData: { inbox }
    });
  }

  @Get('signed_url')
  async signedUrl(@Req() request: Request, @Res() res: Response): Promise<any> {
    const { filename, mime } = request.query

    const Expires = 600 * 600
    const Bucket = process.env.AWS_S3_BUCKET
    const accessKeyId = process.env.AWS_S3_ACCESS_KEY_ID
    const secretAccessKey = process.env.AWS_S3_SECRET_ACCESS_KEY
    const endpoint = new AWS.Endpoint(process.env.AWS_S3_ENDPOINT)

    // Authenticate with DO
    const s3 = new AWS.S3({
      s3BucketEndpoint: true,
      endpoint,
      accessKeyId,
      secretAccessKey,
    })

    var dateObj = new Date()
    var day = dateObj.getUTCDate()
    var month = dateObj.getUTCMonth() + 1
    var year = dateObj.getUTCFullYear()
    const folder = day + '-' + month + '-' + year

    try {
      const Key = folder + '/' + filename
      const ACL = ''
      const ContentType = mime
      const params = { Bucket, Key, Expires, ACL, ContentType }
      const url = s3.getSignedUrl('putObject', params)

      res.status(200).send({ url })
    } catch (err) {
      res.status(500).send({ message: 'Failed' })
    }
  }
}
