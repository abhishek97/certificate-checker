const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

module.exports = {
  async sendEmail({ erroredDomains, nearExpiryDomains }) {
    if (!erroredDomains.length && !nearExpiryDomains.length) {
      return ;
    }

    const msg = {
      to: 'dev@codingblocks.com',
      from: 'certbot@codingblocks.com',
      subject: 'SSL Certificate Status',
      html: '',
    }

    if (erroredDomains.length) {
      msg.html += `These Domains were errored: <b>` + erroredDomains.join(', ') + `</b>. <br>`
    }
    if (nearExpiryDomains.length) {
      msg.html += `These Domain are about to expired: <b>` + nearExpiryDomains.join(', ') + `</b>`
    }
    console.log(msg)
    return sgMail.send(msg)
  }
}