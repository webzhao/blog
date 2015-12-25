/**
 * 为静态资源添加md5版本号
 */

var crypto  = require('crypto');
var fs      = require('fs');
var cache   = {};
const BASE_PATH = './www';

module.exports = function fingerprint(path) {
    if (cache[path]) {
        return cache[path];
    }
    let h = crypto.createHash('md5');
    h.update(fs.readFileSync(BASE_PATH + path), {encoding: 'utf-8'});
    let uri = path + '?v=' + h.digest('hex').substr(0,6);
    cache[path] = uri;
    return uri;
}
