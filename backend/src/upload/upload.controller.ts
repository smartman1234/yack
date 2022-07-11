import { Controller, Post } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'
import { UseInterceptors, UploadedFile } from '@nestjs/common'
import { diskStorage } from 'multer'
import { extname } from 'path'

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        // Generating a 32 random chars long string
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')

        //Calling the callback passing the random name generated with the original extension name
        cb(null, `${randomName}${extname(file.originalname)}`)
      }
    })
  }))
  uploadFile(@UploadedFile() file) {
    const { path } = file
    return { path }
  }
}
