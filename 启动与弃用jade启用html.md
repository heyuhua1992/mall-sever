#window 平台启动命令
- 第一种启动方式
  - set DEBUG=server & npm start
  - 上面的server是项目名字，在package.json中有
---
- 第二种打开方式
  - node ./bin/www
  ```bash
  第二种启动方式是根据原生代码找到的，第一种启动方式官方文档中写的。
  ```
---
#弃用jade启用html
- 第一步
  - 删除views中的.jade文件
- 第二步
  - npm install ejs --save
- 第三步
  - 在app.js 文件中
  - 引入ejs 
    - var ejs = require('ejs');
  - 设置怎么查找.html文件
    - app.engine('.html', ejs.__express)
  - 设置视图引擎
    - app.set('view engine', 'html');
    - 把jade 改成html

