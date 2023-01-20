const { v4: uuidv4 } = require('uuid');

let activeSessionIds = [];
let products = [];

exports.postLogin = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.users.usernames.find((element) => {
    return element === username;
  });
  const pass = req.users.passwords.find((element) => {
    return element === password;
  });
  if (name && pass) {
    const sessionId = uuidv4();
    activeSessionIds.push(sessionId);
    return res.status(200).json({ sessionId: sessionId });
  }
  res.status(401).json({ msg: 'Unauthorized' });
}

exports.addProduct = (req, res, next) => {
  const { username, sessionId, product } = req.body;
  if (activeSessionIds.includes(sessionId)) {
    const existingProductIndex = products.findIndex((el) => {
      return el.productId === product.id && el.username === username;
    });
    if (existingProductIndex > -1 && 
      products[existingProductIndex].username === username
      ) {
      products[existingProductIndex].quantity += 1;
    } else {
      products.push(
        {
          sessionId: sessionId,
          username: username,
          productId: product.id,
          productImg: product.image,
          productTitle: product.title,
          productCost: product.price,
          quantity: 1,
        }
      );
    }
    console.log(products);
    return res.status(200).json({ msg: 'Success' });
  }
  res.status(401).json({ msg: 'Unauthorized' });
}

exports.getTotalProducts = (req, res, next) => {
  const { username, sessionId } = req.query;
  if (activeSessionIds.includes(sessionId)) {
    const productsByUser = products.filter(el => {
      return el.username === username;
    });
    let size = 0;
    for (let index in productsByUser) {
      size += productsByUser[index].quantity
    }
    return res.status(200).json({ size: size });
  }
  res.status(401).json({ msg: 'Unauthorized' });
}

exports.getProducts = (req, res, next) => {
  const { username, sessionId } = req.query;
  if (activeSessionIds.includes(sessionId)) {
    const productsByUser = products.filter(el => {
      return el.username === username;
    });
    let totalCost = 0;
    productsByUser.forEach(prod => {
      totalCost += prod.productCost * prod.quantity;;
    });
    return res.status(200).json({ data: productsByUser, totalCost: totalCost });
  }
  res.status(401).json({ msg: 'Unauthorized' });
}