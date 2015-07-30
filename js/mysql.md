# MySQL

## 关系型数据库

### 关系型数据库优点
* 容易理解：二维表结构是非常贴近逻辑世界的一个概念，关系模型相对网状、层次等其他模型来说更容易理解

* 使用方便：通用的SQL语言使得操作关系型数据库非常方便

* 易于维护：丰富的完整性(实体完整性、参照完整性和用户定义的完整性)大大减低了数据冗余和数据不一致的概率

### 关系型数据库瓶颈

#### 1.高并发读写需求
网站的用户并发性非常高，往往达到每秒上万次读写请求，对于传统关系型数据库来说，硬盘I/O是一个很大的瓶颈

#### 2.海量数据的高效率读写
网站每天产生的数据量是巨大的，对于关系型数据库来说，在一张包含海量数据的表中查询，效率是非常低的

#### 3.高扩展性和可用性
在基于web的结构当中，数据库是最难进行横向扩展的，当一个应用系统的用户量和访问量与日俱增的时候，数据库却没有办法像web server和app server那样简单的通过添加更多的硬件和服务节点来扩展性能和负载能力。对于很多需要提供24小时不间断服务的网站来说，对数据库系统进行升级和扩展是非常痛苦的事情，往往需要停机维护和数据迁移。

#### 4.复杂SQL，特别是多表关联查询
在关系型数据库中，导致性能欠佳的最主要原因是多表的关联查询，以及复杂的数据分析类型的复杂SQL报表查询。为了保证数据库的ACID特性，我们必须尽量按照其要求的范式进行设计，关系型数据库中的表都是存储一个格式化的数据结构。每个元组字段的组成都是一样，即使不是每个元组都需要所有的字段，但数据库会为每个元组分配所有的字段，这样的结构可能便于表与表之间进行链接等操作，但从另一个角度来说它也是关系型数据库性能瓶颈的一个因素。

### ACID
数据库事务必须具备ACID特性，ACID具体指：
* Atomic原子性

* Consistency一致性

* Isolation隔离性

* Durability持久性。


## 非关系型数据库
由于非关系型数据库本身天然的多样性，以及出现的时间较短，因此，不像关系型数据库，有几种数据库能够一统江山，非关系型数据库非常多，并且大部分都是开源的。

这些数据库中，其实实现大部分都比较简单，除了一些共性外，很大一部分都是针对某些特定的应用需求出现的，因此，对于该类应用，具有极高的性能。依据结构化方法以及应用场合的不同，主要分为以下几类：

### 1.面向高性能并发读写的key-value数据库
key-value数据库的主要特点是具有极高的并发读写性能，Redis,Tokyo Cabinet,Flare就是这类的代表

### 2.面向海量数据访问的面向文档数据库
这类数据库的特点是，可以在海量的数据中快速的查询数据，典型代表为MongoDB以及CouchDB

MongoDB希望在大多数应用中做为关系型数据库的替代品，提供这些优点：

* Document-oriented，用文档来组织数据，不需要严格的结构。

* High performance，高性能

* High availability，高可用，比如复制 (Replica set)

* Easy scalability，易扩展，比如Sharding

* Rich query language，富查询


### 3.面向可扩展性的分布式数据库
这类数据库想解决的问题就是传统数据库存在可扩展性上的缺陷，这类数据库可以适应数据量的增加以及数据结构的变化。


## 引用  全面梳理SQL和NoSQL数据库的技术差别

### 数据表VS.数据集
关系型和非关系型数据库的主要差异是数据存储的方式。关系型数据天然就是表格式的，因此存储在数据表的行和列中。数据表可以彼此关联协作存储，也很容易提取数据。与其相反，非关系型数据不适合存储在数据表的行和列中，而是大块组合在一起。非关系型数据通常存储在数据集中，就像文档、键值对或者图结构。你的数据及其特性是选择数据存储和提取方式的首要影响因素。

### 预定义结构VS.动态结构
关系型数据通常对应于结构化数据，因为数据表都有预定义好的结构(列的定义)，结构描述了数据的形式和内容。这一点对数据建模至关重要，你必须“第一时间先把结构定义好”。虽然预定义结构带来了可靠性和稳定性，但是已经存入数据的表结构要修改就非常痛苦了。另一方面，非关系型数据基于动态结构，通常适用于非结构化数据。非关系型数据可以很容易适应数据类型和结构的变化，因为动态结构本身就支持这一点。

### 存储规范化VS存储代价
关系型数据库的数据存储是为了更高的规范性，把数据分隔成最小的逻辑表(关系表)以避免重复，获得最精简的空间利用。虽然数据规范性会使数据管理更清晰，但它通常也会带来一点点复杂性，尤其是单个操作可能涉及多个关系表的时候，数据管理就有点麻烦。另外，更精简的空间利用通常可以节约宝贵的数据存储，但是在当今世界我们基本可以认为存储的代价(磁盘空间)是微不足道的。而非关系型数据存储在平面数据集中，数据经常可能存在重复。单个数据库很少被分隔开，而是存储成一个整体，这样是为了整块数据更容易读写。

### 纵向扩容VS横向扩容
SQL和NoSQL数据库最大的差别可能是在扩展方式上，要支持日益增长的需求当然要扩展。要支持更多并发量，SQL数据库是纵向扩展，也就是说提高处理能力，使用速度更快速的计算机，这样处理相同的数据集就更快了。因为数据存储在关系表中，操作的性能瓶颈可能涉及很多个表，这都需要通过提高计算机性能来克服。虽然SQL数据库有很大扩展空间，但最终肯定会达到纵向扩展的上限。而NoSQL数据库是横向扩展的。非关系型数据存储天然就是分布式的，NoSQL数据库的扩展可以通过给资源池添加更多普通的数据库服务器(节点)来分担负载。

### 结构化查询VS非结构化查询
关系型数据库通过所谓结构化查询语言(也就是我们常说的SQL)来操作数据。SQL支持数据库CRUD(增加，查询，更新，删除)操作的功能非常强大，是业界标准用法。非关系型数据库以块(像文档一样)为单元操纵数据，使用所谓的非结构化查询语言(UnQL)，它是没有标准的，因数据库提供商的不同而不同。关系型表中主键的概念对应非关系存储中的文档Id。SQL数据库使用预定义优化方式(比如列索引定义)帮助加速查询操作，而NoSQL数据库采用更简单而精确的数据访问模式。

### 映射VS本地化
SQL和NoSQL数据存储的选择还取决于开发人员，尽管这个因素影响不大。采用面向对象编程语言的开发人员通常会同时操作一个或多个数据实体(包括嵌套数据、列表和数组的复杂结构)，把数据传递给应用程序用户界面。要是讨论到底层数据库，事情就并不总是那么公平合理了。在关系型存储中，数据实体通常需要分成多个部分进行规范化，然后分开存储到多个关系型表中精简存储。幸运的是，这是一个长期存在的问题，大部分编程平台都有相应的简单解决方案，比如ORM层(对象关系映射)。ORM是位于关系型数据源和开发者使用的面向对象数据实体之间的一个映射层。然而，对于非关系型存储，不需要规范化数据，复杂数据实体可以整体存放在独立单元中。应用程序中使用的对象通常序列化为JSon串，存储在NoSQL数据库的JSon文档中。

### 事务性VS纯扩展性
如果你的数据操作需要高事务性或者复杂数据查询需要控制执行计划，那么传统的SQL数据库从性能和稳定性方面考虑是你的最佳选择。SQL数据库支持对事务原子性细粒度控制，并且易于回滚事务。虽然NoSQL数据库也可以使用事务操作，但它们真正闪亮的价值是在操作的扩展性和大数据量处理方面。

### ACID VS CAP
SQL 数据库久负盛名的价值就是通过所谓的ACID属性(原子性，一致性，隔离性，持久性)保证数据完整性，大部分关系型存储供应商都支持ACID。我们的目标是支持隔离不可分割的事务，其变化是持久的，数据也保持一致状态。而NoSQL数据库是让你在CAP(一致性，可用性，分区容忍度)中的任意两项中选择，因为在基于节点的分布式系统中，很难做到三项都满足。

### 数据VS大数据
SQL数据库可以可靠地存储和处理数据，而NoSQL最大的优势是在应对大数据方面，也就是由我们社会或者计算机每天产生的大量非结构化的数据实体。NoSQL用无模式方式做数据管理，所以其横向扩展潜力是无限的，这可能是深度处理大数据捕获、管理、检索、分析和可视化的唯一有效途径。

### 数据记录VS物联网和人联网
关系数据库在关注数据规范化和保证性能的基础上精简存储。但是近年来，我们产生数据的速度远大于关系型存储能满足存储的能力增长。刺激数据如此迅猛增长的原因是：巨大量的用户数和物联网。连接到互联网的用户在成倍增加，在同步使用我们的应用。由于大量移动设备数据传感设备接入互联网，机器产生的数据量也大幅增加。因此企业必须寻求NoSQL技术及基础架构来处理持续涌入的半结构化和非结构化数据。

### 内部部署VS云计算
云计算现在已经无处不在了，它兼具SQL和NoSQL数据库的益处。云环境中的关系型存储通常是以服务形式提供的，是可复制、高可用性且分布式的，极大地提高了横向扩展能力。托管于云服务中的NoSQL数据库也天然享有自动分片的好处，可以阶段性地灵活弹性处理，集成高速缓存和巨大的计算能力来捕获、存储和分析大数据。

### 付费VS开源
有一种看法认为，SQL数据库大多数比较昂贵，而NoSQL数据库通常都是开源的。事实上，两种类型数据库都有开源的和商业的。常见的SQL 数据库有微软公司的SQL Server，MySQL，SQLite，Oracle和PostGres。流行的NoSQL数据库有Couchbase，MongoDB，Redis，BigTable和RavenDB。

### 结论
SQL和NoSQL这两者都有各自的优缺点，选择正确的架构取决于你构建应用的需求。传统SQL数据库依然非常强大，可以可靠地处理你的事务性需求并保持完整性。只有在你接近关系数据库局限性边缘时，或者你的数据处理量浩如烟海时，操作扩展需要更加分布式的系统时，才考虑NoSQL方案。考虑这些因素之后再做选择

## mysql实践笔记

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

#### 修改mysql中root的密码 

方法一：
```javascript
shell> mysql -h localhost -u root -p //登录 
mysql> use mysql;  // 进入mysql数据库，user表中存放着所有的MYSQL用户信息
mysql> update user set password=password("xueok654123") where user='root';   
mysql> FLUSH PRIVILEGES; //新设置用户或更改密码后需要用flush privileges刷新MySQL的系统权限相关表，否则会出现拒绝访问，或者也可以重新启动mysql来使新设置生效
mysql> describe user; //显示表mysql数据库中user表的列信息);  
mysql> SELECT USER(); //显示当前user
```

方法二：
```javascript
shell> mysqladmin -u root -p oldPass password newPass
```

方法三：
```javascript
shell> mysql -u root

mysql> SET PASSWORD FOR 'root'@'localhost' = PASSWORD('newpass');
```

丢失root密码的时候，可以这样

```javascript
shell> mysqld_safe --skip-grant-tables&

shell> mysql -u root mysql

mysql> UPDATE user SET password=PASSWORD("new password") WHERE user='root';

mysql> FLUSH PRIVILEGES;
```

增加新用户并授予一定权限（格式：grant select on 数据库.* to 用户名@登陆主机 identified by '密码'）：

```php
// 增加一个用户shirly密码为shirly，让她可以再任何主机上登陆，并对所有数据库有查询、插入、修改、删除的权限(前提是用root用户连入MYSQL)
grant select, insert, update, delete on *.* to shirly@"%" identified by 'shirly' 

/** 
  * 增加一个用户test2密码为abc,让他只可以:
  * 1. 在localhost上登录;
  * 2. 可以对数据库mydb进行查询、插入、修改、删除的操作（localhost指本地主机，即MYSQL数据库所在的那台主机）
  * 目的： 用户即使有test2的密码，他也无法从internet上直接访问数据库，只能通过MYSQL主机来访问
  **/
grant select,insert,update,delete on mydb.* to test2@localhost identified by “abc”; 

// 不想test2有密码 
grant select,insert,update,delete on mydb.* to test2@localhost identified by “”;  

// mysql默认的是本地主机是localhost,对应的IP地址就是127.0.0.1，所以你用你的IP地址登录会出错，如果你想用你的IP地址登录就要先用grant命令进行授权。
grant all on *.* to 'someuser'@'somehost' identified by 'password';  

// 如果需要收回对特定用户的权限，可以通过revoke来实现，revoke和grant的使用相似，只是将to改为from，将grant改为revoke
revoke all (privileges) on *.* from username@'somehost';

// 不论是revoke还是grant，执行完操作后都需要flush privileges;才可以立即生效；
// 如果发现revoke all privileges后还是显示如下：

mysql> show grants for shirly@'xxx.xxx.xxx.xxx';
+--------------------------------------------------------------------------------------------------------------------+
| Grants for shirly@xxx.xxx.xxx.xxx                                                                                  |
+--------------------------------------------------------------------------------------------------------------------+
| GRANT USAGE ON *.* TO 'shirly'@'xxx.xxx.xxx.xxx' IDENTIFIED BY PASSWORD '*C645E9AEEE301E788D5FB061F5AEDD737B48357F'|
+--------------------------------------------------------------------------------------------------------------------+

// 那么可以执行以下操作将用户权限彻底消除
mysql> drop user shirly@'xxx.xxx.xxx.xxx';

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

### node mysql遇到的坑

MySQL中有一个名叫wait_timeout的变量，表示操作超时时间，当连接超过一定时间没有活动后，会自动关闭该连接，这个值默认为28800（即8小时）

[做好自动重连](https://cnodejs.org/topic/516b77e86d382773064266df)

mysql中文数据乱码时的解决方式，设置为[utf8](http://stackoverflow.com/questions/3513773/change-mysql-default-character-set-to-utf-8-in-my-cnf)

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
