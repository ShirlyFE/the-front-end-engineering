# MySQL

### mysql的相关概念

实体：数据库用户所关注的对象，如顾客、部门、地理位置等

表: 行的集合，既可以保存在内存中（未持久化），也可以保存在存储设备中（已持久化）

结果集： 未持久化表的另一个名字，一般为SQL查询结果

#### 字符型数据

字符型数据可以使用定长或变长的字符串来实现，不同点在于固定长度的字符串使用空格向右填充，以保证同样的字节数；变长字符串不需要向右填充，并且使用字节数可变，定义字符列时，必须指定该列能存放字符串的最大长度，例如：

```php
    char(20) //可设置最大长度为255个字节
    varchar(20) //最多可以存储65535个字节(64KB)，如需存储比如电子邮件、XML文档等更长的字符串，则需要使用文档类型(mediumtext和longtext)
```

查看服务器所支持的字符集：

```php
    mysql> show character set; // 如果展示字符集列表的第四列Maxlen大于1，那么该字符集为多字符集
```

为数据列指定非默认的字符集只需在类型定义后加上系统支持的字符集名称：

```php
    varchar(20) character set utf8
```

改变整个数据库的默认字符集：

```php
    create database foreign_sales character set utf8;
```

#### 文本数据

需要存储数据超过64KB(varchar列所能容许的上限),就需要使用文本类型,下面是文本类型及其最大的字节数

* **tinytext**: 255
* **text**: 65535
* **mediumtext**: 16777215
* **longtext**: 4294967295

选择文本类型注意点：

* 文本列中数据超出该类型的最大长度，数据会被截断
* 不会消除数据的尾部空格
* 使用文本列排序或分组时，只会使用前1024个字节，需要时可放宽限制

#### 数据型数据

常用的有5种用于存储整数的类型：tinyint, smallint, mediumint, int, bigint

浮点类型：float， double，可以指定精度(小数点左边到右边所允许的数字总位数)和有效位(小数点右边所允许的数字位数)

#### 时间数据

时间类型及其默认格式和允许的值如下：

<table>
    <thead>
        <tr>
            <th>类型</th>
            <th>默认格式</th>
            <th>允许的值</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>date</td>
            <td>YYYY-MM-DD</td>
            <td>1000-01-01~9999-12-31</td>
        </tr>
        <tr>
            <td>datetime</td>
            <td>YYYY-MM-DD HH:MI:SS</td>
            <td>1000-01-01 00:00:00~9999-12-31 23:59:59</td>
        </tr>
        <tr>
            <td>timestamp</td>
            <td>YYYY-MM-DD HH:MI:SS</td>
            <td>1970-01-01 00:00:00~2037-12-31 23:59:59(注意：timestap保存的信息与datetime类型一样，当MySQL服务器可以在向表中增加或修改数据行时自动为timestamp列产生当前的日期/时间)</td>
        </tr>
        <tr>
            <td>year</td>
            <td>YYYY</td>
            <td>1901~2155</td>
        </tr>
        <tr>
            <td>time</td>
            <td>HHH:MI:SS</td>
            <td>-838:59:59~838:59:59</td>
        </tr>
    </tbody>
</table>

### mysql常用命令

select version(),current_date; 显示当前mysql版本和当前日期      

修改mysql中root的密码： 

```javascript
    shell> mysql -h localhost -u root -p //登录 
    mysql> use mysql;  // 进入mysql数据库，user表中存放着所有的MYSQL用户信息
    mysql> update user set password=password("xueok654123") where user='root';   
    mysql> describe user; 显示表mysql数据库中user表的列信息);   
```

增加新用户并授予一定权限（格式：grant select on 数据库.* to 用户名@登陆主机 identified by '密码'）：

```javascript
    grant select, insert, update, delete on *.* to shirly@"%" identified by 'shirly' // 增加一个用户shirly密码为shirly，让她可以再任何主机上登陆，并对所有数据库有查询、插入、修改、删除的权限(前提是用root用户连入MYSQL)

    grant select,insert,update,delete on mydb.* to test2@localhost identified by “abc”; //增加一个用户test2密码为abc,让他只可以在localhost上登录，并可以对数据库mydb进行查询、插入、修改、删除的操作（localhost指本地主机，即MYSQL数据库所在的那台主机），这样用户即使有test2的密码，他也无法从internet上直接访问数据库，只能通过MYSQL主机上的web页来访问了。

    grant select,insert,update,delete on mydb.* to test2@localhost identified by “”; //不想test2有密码  
    
    grant all on *.* to 'someuser'@'somehost' identified by 'password';  //mysql默认的是本地主机是localhost,对应的IP地址就是127.0.0.1，所以你用你的IP地址登录会出错，如果你想用你的IP地址登录就要先用grant命令进行授权。

```

调用命令行工具，同时指定用户名和要使用的数据库:

```
    shell> mysql -u username -p databasename
```

查看当前日期和时间:

```
    mysql> select now();
```

退出mysql命令行可以使用quit或exit

```
    mysql> exit;
```

show databases; 显示数据库   

create database name; 创建数据库   

use databasename; 选择数据库 

drop database name; 直接删除数据库，不提醒   

mysqldump 备份数据库:

```javascript
    shell> mysqldump -h host -u root -p dbname >dbname_backup.sql 
```

恢复数据库:

```javascript
    shell> mysqladmin -h myhost -u root -p create dbname 
    shell> mysqldump -h host -u root -p dbname < dbname_backup.sql  
```

mysqladmin -u root -p drop databasename; 删除数据库前，有提示

show tables; 显示表 

describe tablename; 显示具体的表结构  

创建表：

```php
    CREATE TABLE person
        (person_id SMALLINT UNSIGNED,
         fname VARCHAR(20),
         lname VARCHAR(20),
         gender CHAR(1) NOT NULL, // 也可以是ENUM('M', 'F')意味着该列只可以填M或者F,这就是SQL中所说的检查约束(check)
         birth_date DATE,
         CONSTRAINT pk_person PRIMARY KEY(person_id)
        );
```

上例中约束(constraint)为主键约束，被创建在person_id列上并被命名为pk_person

表中定义外键后，不允许删除在另一个表中具有关联关系的行

控制台下实例：

```php
    root@host# mysql -u root -p
    Enter password:*******
    mysql> use TUTORIALS;
    Database changed
    mysql> CREATE TABLE tutorials_tbl(
       -> tutorial_id INT NOT NULL AUTO_INCREMENT,
       -> tutorial_title VARCHAR(100) NOT NULL,
       -> tutorial_author VARCHAR(40) NOT NULL,
       -> submission_date DATE,
       -> PRIMARY KEY ( tutorial_id )
       -> );
    Query OK, 0 rows affected (0.16 sec)
    mysql>
```

数据库中表的约束有以下几种：
* 主键约束：两种方式直接在字段名后定义或者在最后定义
* 外键约束：比如有数据表tb_dept其主键是id，那么定义数据表tb_emp,让它的deptId作为外键关联到tb_dept的主键，SQL语句为：
```php
   CREATE TABLE tb_emp
        (id INT(11) PRIMARY KEY,
         name VARCHAR(20),
         deptId INT(11),
         salary FLOAT,
         CONSTRAINT fk_emp_dept FOREIGN KEY(deptId) REFERENCES tb_dept(id)
        ); 
```
* 非空约束：NOT NULL
* 唯一性约束：UNIQUE，直接定义在字段之后，或者定义在所创建表的最后，格式为
```php
    CONSTRAINT sth UNIQUE(name)
```
* 默认约束： 直接定义在字段名后，DEFAULT [value]
* 表的自增：AUTO_INCREMENT

当我们需要修改数据表名或者修改数据表字段时，需要使用alter命令

```php
    mysql> alter table t1 rename t2;// 重命名表:
    mysql> alter table t1 drop i; // 删除表t1的i字段
    mysql> alter table t1 add i int; // 向表t1中添加i字段并定义数据类型
    mysql> alter table t1 add i int after c; // after c表明i字段会添加到c字段之后
    mysql> alter table t1 change i j bigint; // 将字段i改为字段j并指定新的数据类型
    mysql> alter table t1 change j j int; // 将字段j的数据类型改为int      
    mysql> alter table t1 modify c char(10);// 将字段c的数据类型设为char(10)
    mysql> ALTER TABLE testalter_tbl ALTER i SET DEFAULT 1000; //修改字段默认值
    mysql> ALTER TABLE testalter_tbl ALTER i DROP DEFAULT;// 删除字段默认值
    mysql> 
```

MySQL可以方便的从查询结果中生成XML，只需要在调用mysql工具时使用--xml选项

```php
    shell> mysql -u root -p --xml tablename
```

### 参考资料

* [mysql的安装配置使用教程](http://www.cnblogs.com/mr-wid/archive/2013/05/09/3068229.html)

* [mysql and node tutorial in production](http://codeforgeek.com/2015/01/nodejs-mysql-tutorial/)

* [优化网站性能之数据库架构篇](http://www.lovelucy.info/website-database-optimization.html)

* [《MongoDB实战》试读：第一章：为现代Web而生的数据库](http://book.douban.com/reading/21674153/)

* [MySQL索引背后的数据结构及算法原理](http://blog.codinglabs.org/articles/theory-of-mysql-index.html)

* [讲述mysql索引和优化的故事](http://database.51cto.com/art/201107/278040.htm)

**mysql读书列表**：

* [《SQL学习指南》](../pdf/SQL学习指南.pdf)
* [《MYSQL性能调优与架构设计》](../pdf/MySQL性能调优与架构设计.pdf)
* [《高可用MYSQL：构建健壮的数据中心》](../pdf/高可用MySQL：构建健壮的数据中心.pdf)
* [《SQL反模式》](../pdf/SQL反模式.pdf)
* [《大话存储-网络存储系统原理精解与最佳实践](../pdf/大话存储-网络存储系统原理精解与最佳实践.pdf)
* [《深入理解MYSQL核心技术》](../pdf/深入理解MySQL核心技术.pdf)
* [《高性能MYSQL》](../pdf/高性能MySQL第三版.pdf)
