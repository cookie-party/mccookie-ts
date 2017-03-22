export function getLocation() {
  const protocol = process.env.protocol || 'http'; 
  const host = process.env.host || '127.0.0.1';
  const port = process.env.port || 7777;
  // console.log(protocol + '://' + host + ':' + port);
  return protocol + '://' + host + ':' + port;
}