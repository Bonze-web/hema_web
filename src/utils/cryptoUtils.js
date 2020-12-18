import CryptoJs from 'crypto-js' // 引用AES源码js

const keyStr = "e6ef616dc57343248f6b3e98a07e1dde" // 16位，密钥字符串

const CryptoInfo = {
  // 加密,调用该方法时，传入的data必须是字符串类型，
  //   故，如果要加密对象等类型，需要先用JSON.stringify()将其字符串化再传入
  encryptByAES: data => {
    const key = CryptoJs.enc.Utf8.parse(keyStr); // 将字符串的转为WordArray类型
    const mydata = CryptoJs.enc.Utf8.parse(data);
    // console.log('key:', key, 'mydata:', mydata)
    const udata = CryptoJs.AES.encrypt(mydata, key, {
      mode: CryptoJs.mode.ECB, // 加密模式，ECB模式
      padding: CryptoJs.pad.Pkcs7 // 填充方式
    });
    const encrypted = udata.toString(); //  返回的是base64的密文,是字符串类型
    return encrypted
  },
  // 解密, 调用该方法时，传入的data是base64的密文
  decryptByAES: data => {
    const key = CryptoJs.enc.Utf8.parse(keyStr);
    const udata = CryptoJs.AES.decrypt(data, key, {
      mode: CryptoJs.mode.ECB,
      padding: CryptoJs.pad.Pkcs7
    });
    const decrypted = udata.toString(CryptoJs.enc.Utf8); // 返回的是加密之前的原始数据,是字符串类型
    return decrypted
  }
};
export {
  CryptoInfo
}
