1.  导入公钥

    ```bash
    > sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
    ```

2.  创建源列表文件 MongoDB

    ```bash
    > echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list
    ```

3.  更新存储库

    ```bash
    > sudo apt-get update
    ```

4.  安装 MongoDB

    ```bash
    > sudo apt-get install -y mongodb-org

    ```

    4.1 启动 MongoDB 并将其添加为在启动时启动的服务

    ```bash
    > systemctl start mongod
    > systemctl enable mongod
    ```

    4.2 用 netstat 命令检查 MongoDB 是否在端口 27017 上启动

    ```bash
    > netstat -plntu
    ```

    4.3 安装好后输入 mongo 测试，成功进入 mongo 命令行界面就证明安装成功了

    ```bash
    > mongo
    ```

5.  命令

    ```bash
    sudo service mongodb start
    sudo service mongodb stop
    ```
