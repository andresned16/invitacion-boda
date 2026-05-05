import QRCode from 'qrcode'

const url = 'https://boda-karen-andres-umber.vercel.app/thankyoupage'

QRCode.toFile(
  './public/qr-boda.png',
  url,
  {
    width: 400,
    margin: 2,
    errorCorrectionLevel: 'H',
    color: {
      dark: '#5c4a3a',
      light: '#ffffff'
    }
  }
).then(() => {
  console.log('✅ QR generado en /public/qr-boda.png')
}).catch(err => {
  console.error(err)
})

//App para crear codigos QR