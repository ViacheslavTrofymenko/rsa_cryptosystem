let bigInt = require('big-integer');

//KEY generation
// Function to genereate a random prime number
const generateRandomPrime = (bitLength) => {
  while (true) {
    let num = bigInt.randBetween(
      bigInt.one.shiftLeft(bitLength - 1),
      bigInt.one.shiftLeft(bitLength)
    );
    if (num.isProbablePrime()) {
      return num;
    }
  }
};

// RSA key generation

const generateRSAKeys = (bitLength) => {
  let p = generateRandomPrime(bitLength / 2);
  let q = generateRandomPrime(bitLength / 2);
  let n = p.multiply(q);
  let phi = p.subtract(1).multiply(q.subtract(1));
  let e = bigInt(31);
  let d = e.modInv(phi);

  let publicKey = {
    e: e.toString(),
    n: n.toString(),
  };
  let privateKey = {
    d: d.toString(),
    n: n.toString(),
  };
  return { publicKey, privateKey };
};

// Function to encode message
const encode = (str) => {
  const encoder = new TextEncoder('utf-8');
  const utf8 = encoder.encode(str);
  const encodedMessage = utf8.join('');
  console.log(encodedMessage);
  return bigInt(encodedMessage);
};

// Function to decode message
const decode = (decryptedMsg) => {
  const stringified = decryptedMsg.toString();
  let string = '';

  for (let i = 0; i < stringified.length; i += 2) {
    let num = Number(stringified.substr(i, 2));

    if (num <= 30) {
      string += String.fromCharCode(Number(stringified.substr(i, 3)));
      i++;
    } else {
      string += String.fromCharCode(num);
    }
  }

  return string;
};

// Function to encrypt a message
const RSAEncrypt = (message, publicKey) => {
  let m = encode(message);
  let e = bigInt(publicKey.e);
  let n = bigInt(publicKey.n);
  let c = m.modPow(e, n);
  return c;
};

// Function to decrypt a message
const RSADecrypt = (encryptedText, privateKey) => {
  let c = bigInt(encryptedText);
  let d = bigInt(privateKey.d);
  let n = bigInt(privateKey.n);
  let m = c.modPow(d, n);

  return m.toString();
};

// Generate a 1024-bit RSA key pair
let message = 'Hello cryptography';
let keyPair = generateRSAKeys(1024);
let encryptedText = RSAEncrypt(message, keyPair.publicKey);
let decryptedMessage = decode(RSADecrypt(encryptedText, keyPair.privateKey));

console.log('Public Key: ', keyPair.publicKey);
console.log('Private Key: ', keyPair.privateKey);
console.log('DecryptedMessage: ', decryptedMessage);
