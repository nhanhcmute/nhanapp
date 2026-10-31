// Danh sách từ điển theo trang. Tên key ở đây là namespace dùng trong t('<namespace>.<key>').
import auth from './auth';
import shop from './shop';
import checkout from './checkout';
import account from './account';
import content from './content';
import admin from './admin';

const pageNamespaces = {
  auth,
  shop,
  checkout,
  account,
  content,
  admin,
};

export default pageNamespaces;
