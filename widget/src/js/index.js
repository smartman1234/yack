import './index.css';
import * as p from '../package.json'

(function Yack() {
  const VERSION = p.version;
  const YACK_IS_DEV = window.location.hostname == "localhost";
  const YACK_URL = YACK_IS_DEV ? "http://localhost:3000/webhook/widget/" : "https://api.yack.app/webhook/widget/";
  const YACK_UPLOAD_URL = YACK_IS_DEV ? "http://localhost:3000/webhook/upload" : "https://api.yack.app/webhook/upload";
  const YACK_STYLESHEET = `https://assets.yack.app/${VERSION}.css`;
  const YACK_DIV_IDS = {
    INIT_BUTTON: 'yack',
    HEADER_CONTAINER: 'yack.header.container',
    WIDGET_CONTAINER: 'yack.widget.container',
    PARENT_CONTAINER: 'yack.parent.container',
    LOADING_CONTAINER: 'yack.loading.container',
    FILE_LOADING_CONTAINER: 'yack.file.loading.container',
    ERROR_CONTAINER: 'yack.error.container',
    HEADING_CONTAINER: 'yack.heading.container',
    DESCRIPTION_CONTAINER: 'yack.description.container',
    FORM_CONTAINER: 'yack.form.container',
    SELECTABLE_LABELS_CONTAINER: 'yack.selectable.labels.container',
    LABELS_CONTAINER: 'yack.labels.container',
    EMAIL_CONTAINER: 'yack.email.container',
    TITLE_CONTAINER: 'yack.title.container',
    NAME_CONTAINER: 'yack.name.container',
    COMMENT_CONTAINER: 'yack.comment.container',
    FOOTER_CONTAINER: 'yack.footer.container',
    DONE_CONTAINER: 'yack.done.container',
    BACK_BUTTON: 'yack.back.button',
    NEXT_BUTTON: 'yack.next.button',
    SUBMIT_BUTTON: 'yack.submit.button',
    CLOSE_BUTTON: 'yack.close.button',
    CLOSE_BUTTON_SVG: 'yack.close.button.svg',
    ATTACHMENT_INPUT: 'yack.attachment.input',
    ATTACHMENTS_CONTAINER: 'yack.attachments.container',
    ATTACHMENT_INPUT_BUTTON: 'yack.attachment.input.button',
    SCREENSHOT_INPUT_BUTTON: 'yack.screenshot.input.button',
    FOOTER_CREDITS: 'yack.footer-credits',
  }
  let SELECTED_LABEL = []
  let SLUG = "";
  const YACK_HTML = `
    <div class="yack-container small" id="${YACK_DIV_IDS.PARENT_CONTAINER}">
      <div class="yack-close" id="${YACK_DIV_IDS.CLOSE_BUTTON}">
        <svg
          id="${YACK_DIV_IDS.CLOSE_BUTTON_SVG}"
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 24 24">
          <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" />
        </svg>
      </div>

      <div class="yack-done" id="${YACK_DIV_IDS.DONE_CONTAINER}">
        <span>Thank you!</span>
      </div>

      <div class="yack-file-loading" id="${YACK_DIV_IDS.FILE_LOADING_CONTAINER}">
        <img src="https://yack.app/assets/loading.svg" border="0" />
      </div>

      <div class="yack-loading" id="${YACK_DIV_IDS.LOADING_CONTAINER}">
        <img src="https://yack.app/assets/loading.svg" border="0" />
      </div>

      <div class="header" id="${YACK_DIV_IDS.HEADER_CONTAINER}">
        <div class="heading" id="${YACK_DIV_IDS.HEADING_CONTAINER}"></div>
        <div class="description" id="${YACK_DIV_IDS.DESCRIPTION_CONTAINER}"></div>
      </div>

      <div class="body-content">
        <div class="error" id="${YACK_DIV_IDS.ERROR_CONTAINER}"></div>

        <!-- Labels -->
        <div class="inner-content hide" id="${YACK_DIV_IDS.LABELS_CONTAINER}">
          <div class="heading">
            What type of message do you want to send?
          </div>

          <div class="content">
            <div class="selectable-labels" id="${YACK_DIV_IDS.SELECTABLE_LABELS_CONTAINER}"></div>
          </div>
        </div>

        <!-- Form -->
        <div class="inner-content hide" id="${YACK_DIV_IDS.FORM_CONTAINER}">
          <div class="heading">
            Enter some contact information.
          </div>

          <input type="file" id="${YACK_DIV_IDS.ATTACHMENT_INPUT}" multiple style="display: none;"/>

          <div class="content">
            <div class="form-row">
              <label for="${YACK_DIV_IDS.EMAIL_CONTAINER}">Email</label>
              <input type="text" id="${YACK_DIV_IDS.EMAIL_CONTAINER}" placeholder="Email address" />
            </div>
            <div class="form-row">
              <label for="${YACK_DIV_IDS.NAME_CONTAINER}">Full name</label>
              <input type="text" id="${YACK_DIV_IDS.NAME_CONTAINER}" placeholder="Full name" />
            </div>
            <div class="form-row">
              <label for="${YACK_DIV_IDS.TITLE_CONTAINER}">Subject</label>
              <input type="text" id="${YACK_DIV_IDS.TITLE_CONTAINER}" placeholder="Subject" />
            </div>
            <div class="form-row">
              <label for="${YACK_DIV_IDS.COMMENT_CONTAINER}">Comment</label>
              <textarea id="${YACK_DIV_IDS.COMMENT_CONTAINER}" placeholder="Your comment"></textarea>
            </div>

            <div class="form-attachments" id="${YACK_DIV_IDS.ATTACHMENTS_CONTAINER}"></div><br/>

            <div class="form-attachment-buttons">
              <a href="javascript:void(0)" id="${YACK_DIV_IDS.ATTACHMENT_INPUT_BUTTON}" class="form-attachment-button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15" height="15">
                  <path fill="none" d="M0 0h24v24H0z"/>
                  <path fill="white" d="M14 13.5V8a4 4 0 1 0-8 0v5.5a6.5 6.5 0 1 0 13 0V4h2v9.5a8.5 8.5 0 1 1-17 0V8a6 6 0 1 1 12 0v5.5a3.5 3.5 0 0 1-7 0V8h2v5.5a1.5 1.5 0 0 0 3 0z"/>
                </svg>
                <span>Add file</span>
              </a>

              <a href="javascript:void(0)" id="${YACK_DIV_IDS.SCREENSHOT_INPUT_BUTTON}" class="form-attachment-button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15" height="15">
                  <path fill="none" d="M0 0h24v24H0z"/>
                  <path fill="white" d="M3 3h2v2H3V3zm4 0h2v2H7V3zm4 0h2v2h-2V3zm4 0h2v2h-2V3zm4 0h2v2h-2V3zm0 4h2v2h-2V7zM3 19h2v2H3v-2zm0-4h2v2H3v-2zm0-4h2v2H3v-2zm0-4h2v2H3V7zm7.667 4l1.036-1.555A1 1 0 0 1 12.535 9h2.93a1 1 0 0 1 .832.445L17.333 11H20a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h2.667zM9 19h10v-6h-2.737l-1.333-2h-1.86l-1.333 2H9v6zm5-1a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
                </svg>
                <span>Take screenshot</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="footer" id="${YACK_DIV_IDS.FOOTER_CONTAINER}">
        <button class="submit" id="${YACK_DIV_IDS.BACK_BUTTON}">
          Back
        </button>

        <button class="submit" id="${YACK_DIV_IDS.NEXT_BUTTON}">
          Next
        </button>

        <button class="submit" id="${YACK_DIV_IDS.SUBMIT_BUTTON}">
          Submit
        </button>
      </div>
      <div class="footer-credits" id="${YACK_DIV_IDS.FOOTER_CREDITS}">
        <a href="https://yack.app" target="_blank">
          <span>Powered by Yack</span>
          <svg class="yack-logo" width="15" height="15" viewBox="0 0 94 66" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
            <g transform="matrix(1,0,0,1,-1319,-412.358)">
              <g transform="matrix(2.2479e-17,-0.36711,0.36711,2.2479e-17,1276.48,501.233)">
                <g>
                  <path d="M241.822,150.812C241.779,142.739 237.843,135.183 231.251,130.523C224.659,125.863 216.222,124.672 208.598,127.325C173.664,139.48 123.554,156.916 123.554,156.916C123.554,156.916 123.551,156.917 123.545,156.92C111.977,162.023 104.168,173.093 103.242,185.703C102.316,198.313 108.423,210.404 119.121,217.143C123.075,219.634 125.552,221.194 125.552,221.194L125.553,221.194C142.914,228.532 162.359,229.27 180.226,223.268C188.03,220.647 196.647,217.752 204.908,214.978C227.101,207.523 242.01,186.673 241.887,163.262C241.865,159.111 241.843,154.91 241.822,150.812Z" style="fill:#DEE2E6;"/>
                </g>
              </g>
              <g transform="matrix(2.2479e-17,-0.36711,0.36711,2.2479e-17,1276.48,501.233)">
                <g>
                  <path d="M90.138,226.788C90.141,225.921 90.738,225.169 91.582,224.97C92.426,224.771 93.297,225.177 93.687,225.951C97.344,230.622 104.879,237.45 119.877,244.401C137.331,252.241 189.048,270.132 218.631,280.202C231.46,284.665 240.1,296.711 240.215,310.294C240.294,318.505 240.374,327.959 240.45,336.942C240.517,344.825 236.728,352.244 230.303,356.812C223.878,361.38 215.627,362.522 208.203,359.869C192.846,354.383 173.94,347.628 155.79,341.144C116.375,327.063 90.08,289.709 90.119,247.855C90.127,239.305 90.134,231.822 90.138,226.788Z" style="fill:#DEE2E6;"/>
                </g>
              </g>
            </g>
          </svg>
        </a>
      </div>
    </div>
  `;
  let YACK_ATTACHMENTS = [];

  function getElement(elementId) {
    return document.getElementById(elementId)
  }

  function addClass(element, className) {
    element.classList.add(className)
  }

  function removeClass(element, className) {
    element.classList.remove(className)
  }

  function destroyWidgetOnPage() {
    const element = getElement(YACK_DIV_IDS.WIDGET_CONTAINER);

    if (element) element.innerHTML = '';
  }

  function showSection(section) {
    const parentContainer = getElement(YACK_DIV_IDS.PARENT_CONTAINER)
    const doneContainer = getElement(YACK_DIV_IDS.DONE_CONTAINER)
    const labelsElement = getElement(YACK_DIV_IDS.LABELS_CONTAINER)
    const formElement = getElement(YACK_DIV_IDS.FORM_CONTAINER)

    if (labelsElement && formElement) {
      switch (section) {
        case YACK_DIV_IDS.LABELS_CONTAINER:
          removeClass(labelsElement, 'hide');
          addClass(formElement, 'hide');
          break;
          case YACK_DIV_IDS.FORM_CONTAINER:
            addClass(labelsElement, 'hide');
            removeClass(formElement, 'hide');
            break;
        case YACK_DIV_IDS.DONE_CONTAINER:
          removeClass(parentContainer, 'small')
          removeClass(doneContainer, 'hide')
          break;
        default:
          removeClass(labelsElement, 'hide');
          removeClass(formElement, 'hide');
      }
    }
  }

  function heading(text) {
    const element = getElement(YACK_DIV_IDS.HEADING_CONTAINER)
    if (element) element.innerHTML = text;
  }

  function description(text) {
    const element = getElement(YACK_DIV_IDS.DESCRIPTION_CONTAINER)
    if (element) element.innerHTML = text;
  }

  function error(text) {
    const element = getElement(YACK_DIV_IDS.ERROR_CONTAINER)
    if (element) element.innerHTML = text;
  }

  function loaded() {
    const parentContainer = getElement(YACK_DIV_IDS.PARENT_CONTAINER)
    const loadingContainer = getElement(YACK_DIV_IDS.LOADING_CONTAINER)
    const doneContainer = getElement(YACK_DIV_IDS.DONE_CONTAINER)
    const closeButton = getElement(YACK_DIV_IDS.CLOSE_BUTTON)
    const footerCredits = getElement(YACK_DIV_IDS.FOOTER_CREDITS)

    removeClass(footerCredits, 'hide')
    removeClass(parentContainer, 'small')
    addClass(loadingContainer, 'hide')
    addClass(doneContainer, 'hide')
    removeClass(closeButton, 'hide');

    showSection(YACK_DIV_IDS.LABELS_CONTAINER);
  }

  function loading(on) {
    const fileLoadingContainer = getElement(YACK_DIV_IDS.FILE_LOADING_CONTAINER)
    if (!on) addClass(fileLoadingContainer, 'hide')
    if (on) removeClass(fileLoadingContainer, 'hide')
  }

  function resetSelections() {
    const selectableLabels = getElement(YACK_DIV_IDS.SELECTABLE_LABELS_CONTAINER)
    const emailInput = getElement(YACK_DIV_IDS.EMAIL_CONTAINER)
    const titleInput = getElement(YACK_DIV_IDS.TITLE_CONTAINER)
    const nameInput = getElement(YACK_DIV_IDS.NAME_CONTAINER)
    const commentInput = getElement(YACK_DIV_IDS.COMMENT_CONTAINER)

    SELECTED_LABEL = null
    YACK_ATTACHMENTS = []

    syncAttachmentsDOM();

    selectableLabels.innerHTML = "";
    emailInput.value = "";
    nameInput.value = "";
    commentInput.value = "";
    titleInput.value = "";
  }

  function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

    while(n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {type:mime});
  }

  function takeScreenshot() {
    if (!navigator) return error('Browser not supported')
    if (!navigator.mediaDevices) return error('Browser not supported')
    if (!navigator.mediaDevices.getDisplayMedia) return error('Browser not supported')

    navigator.mediaDevices.getDisplayMedia({
      video: {
        cursor: "always"
      },
      audio: false
    }).then(stream => {
      const video = document.createElement('video')

      new Promise((resolve, reject) => {
          video.onloadedmetadata = () => {
              video.play()
              video.pause()
              const canvas = document.createElement('canvas')
              canvas.width = video.videoWidth
              canvas.height = video.videoHeight
              const context = canvas.getContext('2d')
              context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
              resolve(canvas)
          }
          video.srcObject = stream
      }).then(canvas => {
        // Kill the tracks
        stream.getTracks().forEach((track) => track.stop())

        const filename = `screenshot-${YACK_ATTACHMENTS.length + 1}.png`
        const base64 = canvas.toDataURL("image/png")
        const file = dataURLtoFile(base64, filename);

        uploadFile(file)
      })
    })
    .catch(err => {
      console.error(err)
      error('Error taking screenshot')
    })
  }

  function fetchInbox() {
    const selectableLabels = getElement(YACK_DIV_IDS.SELECTABLE_LABELS_CONTAINER)

    // Elements that need to be colored
    const nextButton = getElement(YACK_DIV_IDS.NEXT_BUTTON)
    const backButton = getElement(YACK_DIV_IDS.BACK_BUTTON)
    const submitButton = getElement(YACK_DIV_IDS.SUBMIT_BUTTON)
    const headerContainer = getElement(YACK_DIV_IDS.HEADER_CONTAINER)
    const doneContainer = getElement(YACK_DIV_IDS.DONE_CONTAINER)
    const closeButtonSVG = getElement(YACK_DIV_IDS.CLOSE_BUTTON_SVG)
    const attachmentInputButton = getElement(YACK_DIV_IDS.ATTACHMENT_INPUT_BUTTON)
    const screenshotInputButton = getElement(YACK_DIV_IDS.SCREENSHOT_INPUT_BUTTON)

    // This is used for the file loading
    loading(false)

    // Set up the main AJAX request
    const http = new XMLHttpRequest();
    const url = YACK_URL + SLUG ;

    // Make the request
    http.open("GET", url);
    http.send();
    http.onloadend = (e) => {
      const json = JSON.parse(http.responseText);
      const { id, name, active, widget, form, labelTexts, labelIds } = json;
      const labels = [];

      // Needs to be active / paid
      if (!active) return destroyWidgetOnPage()

      // Otherwise continue
      nextButton.style.backgroundColor = widget.color;
      backButton.style.backgroundColor = widget.color;
      submitButton.style.backgroundColor = widget.color;
      headerContainer.style.backgroundColor = widget.color;
      doneContainer.style.backgroundColor = widget.color;
      closeButtonSVG.style.fill = widget.color;
      attachmentInputButton.style.backgroundColor = widget.color;
      screenshotInputButton.style.backgroundColor = widget.color;

      heading(widget.heading)
      description(widget.text)

      // Create the labels
      labelTexts.map((labelText, index) => {
        labels.push({
          id: labelIds[index],
          text: labelText,
        })
      })

      // Create all the labels in the DOM
      labels.map(label => {
        const div = document.createElement('div')

        div.setAttribute('id', 'label' + label.id)
        div.setAttribute('class', 'label')
        div.innerHTML = label.text;

        selectableLabels.append(div);
      })

      // Wait for the colors to be set
      setTimeout(() => loaded(), 250);
    }
  }

  function createStylesheet() {
    var stylesheet = document.createElement('link');

    stylesheet.href = YACK_STYLESHEET;
    stylesheet.rel = 'stylesheet';
    stylesheet.type = 'text/css';

    document.getElementsByTagName("head")[0].appendChild(stylesheet);
  }

  function getBrowser() {
    // Opera 8.0+
    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

    // Firefox 1.0+
    var isFirefox = typeof InstallTrigger !== 'undefined';

    // Safari 3.0+ "[object HTMLElementConstructor]"
    var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification));

    // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/false || !!document.documentMode;

    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;

    // Chrome 1 - 79
    var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

    // Edge (based on chromium) detection
    var isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1);

    // Blink engine detection
    var isBlink = (isChrome || isOpera) && !!window.CSS;

    if (isOpera) return 'Opera'
    if (isFirefox) return 'Firefox'
    if (isSafari) return 'Safari'
    if (isIE) return 'IE'
    if (isEdge) return 'Edge'
    if (isChrome) return 'Chrome'
    if (isEdgeChromium) return 'Edge Chromium'
    if (isBlink) return 'Blink'
  }

  function submit() {
    const http = new XMLHttpRequest();
    const url = YACK_URL + SLUG ;

    const parentContainer = getElement(YACK_DIV_IDS.PARENT_CONTAINER);
    const doneContainer = getElement(YACK_DIV_IDS.DONE_CONTAINER);
    const loadingContainer = getElement(YACK_DIV_IDS.LOADING_CONTAINER);
    const emailInput = getElement(YACK_DIV_IDS.EMAIL_CONTAINER);
    const nameInput = getElement(YACK_DIV_IDS.NAME_CONTAINER);
    const titleInput = getElement(YACK_DIV_IDS.TITLE_CONTAINER);
    const commentInput = getElement(YACK_DIV_IDS.COMMENT_CONTAINER);
    const footerCredits = getElement(YACK_DIV_IDS.FOOTER_CREDITS);

    const emailValue = emailInput.value;
    const nameValue = nameInput.value;
    const titleValue = titleInput.value;
    const commentValue = commentInput.value;

    // Some things need to be selected
    if (SELECTED_LABEL == null || emailValue == "" || nameValue == "" || titleValue == "" || commentValue == "") {
      return error("Please complete all fields");
    }

    // With a proper email
    if (!validateEmail(emailInput.value)) {
      return error("We need a proper email address");
    }

    // start
    removeClass(loadingContainer, 'hide');

    // Get brwoser details
    const agent = navigator ? navigator.userAgent ? navigator.userAgent : 'N/A' : 'N/A'
    const browser = getBrowser()

    // Make the request
    http.open("POST", url);
    http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    http.send(JSON.stringify({
      label: SELECTED_LABEL,
      email: emailValue,
      name: nameValue,
      title: titleValue,
      comment: commentValue,
      agent: agent,
      browser: browser,
      attachments: JSON.stringify(YACK_ATTACHMENTS),
    }));

    http.onreadystatechange = function() {
      if (this.readyState === XMLHttpRequest.DONE && (this.status === 201 || this.status === 200)) {
        addClass(parentContainer, 'small');
        addClass(footerCredits, 'hide');
        removeClass(doneContainer, 'hide');
      } else {
        error("There has been an error.")
      }

      addClass(loadingContainer, 'hide');
    }
  }

  function selectableLabelsClickHandler(e) {
    const selectableLabels = getElement(YACK_DIV_IDS.SELECTABLE_LABELS_CONTAINER)
    const elementId = e.target.id;
    const element = document.getElementById(elementId)

    // Reset this
    SELECTED_LABEL = null

    // Remove all selected classes
    for (let child of selectableLabels.children) {
      removeClass(child, 'selected')
    }

    // Add the selected class to the clicked on el
    addClass(element, 'selected')

    const labelId = Number(elementId.replace('label', ''));
    const labelText = element.innerHTML;

    // Use this as SELECTED
    SELECTED_LABEL = { id: labelId, text: labelText }
  }

  function syncAttachmentsDOM() {
    const attachmentsContainer = getElement(YACK_DIV_IDS.ATTACHMENTS_CONTAINER)
    let elementHTML = ''

    YACK_ATTACHMENTS.map((attachment, index) => {
      elementHTML += `
        <div class="form-attachment">
          <div class="filename">${attachment.filename}</div>
          <div class="delete-text" data-index="${index}">Delete</div>
        </div>
      `
    })

    attachmentsContainer.innerHTML = elementHTML
  }

  function initUploads() {
    const attachmentInput = getElement(YACK_DIV_IDS.ATTACHMENT_INPUT)
    const attachmentsContainer = getElement(YACK_DIV_IDS.ATTACHMENTS_CONTAINER)
    const attachmentButton = getElement(YACK_DIV_IDS.ATTACHMENT_INPUT_BUTTON)
    const screenshotButton = getElement(YACK_DIV_IDS.SCREENSHOT_INPUT_BUTTON)

    // Open the file input when this is clicked
    screenshotButton.addEventListener('click', (e) => {
      error(null)
      takeScreenshot()
    })

    // Open the file input when this is clicked
    attachmentButton.addEventListener('click', (e) => {
      error(null)
      attachmentInput.click()
    })

    // Handle the delete button in the file list
    attachmentsContainer.addEventListener('click', (e) => {
      YACK_ATTACHMENTS = YACK_ATTACHMENTS.filter((_, index) => Number(e.target.dataset.index) != index)
      syncAttachmentsDOM();
    })

    // Get the s3 upload URL
    attachmentInput.addEventListener('change', (e) => {
      for (let file of e.target.files) {
        uploadFile(file)
      }
    })
  }

  function uploadFile(file) {
    const url = YACK_UPLOAD_URL;
    const { name, type } = file
    const http = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);
    http.open("POST", url);
    http.send(formData);

    loading(true)

    // Make the request
    http.onloadend = (e) => {
      const json = JSON.parse(http.responseText);
      const { url } = json;

      // This has happened on production
      if (!url) {
        error('Upload failed')
        loading(false)
        return
      }

      // Add it to our list
      YACK_ATTACHMENTS.push({
        filename: name,
        type,
        url,
      });

      // Debug
      console.log({
        filename: name,
        type,
        url,
      })

      // Update the UI
      loading(false);
      syncAttachmentsDOM();
    }
    http.onreadystatechange = function() {
      if (this.readyState === XMLHttpRequest.DONE && (this.status === 201 || this.status === 200)) {
        console.log('Done')
      } else {
        //console.log(this.status)
        //error("There has been an error.")
      }
    }
  }

  function initButtons() {
    const nextButton = getElement(YACK_DIV_IDS.NEXT_BUTTON)
    const backButton = getElement(YACK_DIV_IDS.BACK_BUTTON)
    const submitButton = getElement(YACK_DIV_IDS.SUBMIT_BUTTON)
    const closeButton = getElement(YACK_DIV_IDS.CLOSE_BUTTON)
    const selectableLabels = getElement(YACK_DIV_IDS.SELECTABLE_LABELS_CONTAINER)
    const footerCredits = getElement(YACK_DIV_IDS.FOOTER_CREDITS)

    removeClass(nextButton, 'hide');
    addClass(backButton, 'hide');
    addClass(submitButton, 'hide');
    addClass(footerCredits, 'hide');

    selectableLabels.addEventListener('click', selectableLabelsClickHandler)

    closeButton.addEventListener('click', (e) => {
      destroyWidgetOnPage();
    })

    nextButton.addEventListener('click', (e) => {
      addClass(nextButton, 'hide');
      removeClass(backButton, 'hide');
      removeClass(submitButton, 'hide');
      showSection(YACK_DIV_IDS.FORM_CONTAINER);
    })

    backButton.addEventListener('click', (e) => {
      removeClass(nextButton, 'hide');
      addClass(backButton, 'hide');
      addClass(submitButton, 'hide');
      showSection(YACK_DIV_IDS.LABELS_CONTAINER);
    })

    submitButton.addEventListener('click', (e) => {
      submit();
    })
  }

  function createWidgetOnPage(slug) {
    let element = getElement(YACK_DIV_IDS.WIDGET_CONTAINER)

    // If it's already there
    if (!element) {
      element = document.createElement('div');

      // Set some attributes
      element.innerHTML = YACK_HTML;
      element.setAttribute('id', YACK_DIV_IDS.WIDGET_CONTAINER);

      // Add it to the page
      document.body.prepend(element);
    } else {
      // Just update the content
      element.innerHTML = YACK_HTML;
    }

    // Set this up
    SLUG = slug;

    // Add the button clicks
    initUploads();
    initButtons();
    resetSelections();
    fetchInbox();
  }

  function initApplication() {
    if (!YACK_IS_DEV) createStylesheet();

    const el = getElement(YACK_DIV_IDS.INIT_BUTTON);

    if (!el) return;

    el.addEventListener('click', () => {
      createWidgetOnPage(el.dataset.inbox);
    })
  }

  window.addEventListener('DOMContentLoaded', (e) => {
    initApplication();
    // Debug
    // setTimeout(() => createWidgetOnPage('weekday'), 0);
    // showSection(YACK_DIV_IDS.DONE_CONTAINER)
    // setTimeout(() => showSection(YACK_DIV_IDS.FORM_CONTAINER), 1000)
    // setTimeout(() => syncAttachmentsDOM(), 2000)
    // setTimeout(() => loading(true), 3000)
  })

  window.onload = initApplication;
})()
