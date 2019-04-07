const { promisify } = require("es6-promisify");
const checkCertExpiration = promisify(require('check-cert-expiration'))
const { sendEmail } = require('./email')

const domains = process.env.domains.split(',').map(d => d.trim())

async function handler () {
  const erroredDomains = [], nearExpiryDomains = []

  const checkDomains = domains.map(async domain => {
    const url = 'https://' + domain
    const result = await checkCertExpiration(url).catch(err => erroredDomains.push(domain))
  
    if (result.daysLeft < 2) {
      nearExpiryDomains.push(domain)
    }
  })

  await Promise.all(checkDomains)
  await sendEmail({erroredDomains, nearExpiryDomains})

  const response = {
    statusCode: 200,
    body: JSON.stringify('Done')
  }

  return response;
}


exports.handler = handler 