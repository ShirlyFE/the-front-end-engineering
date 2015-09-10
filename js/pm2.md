# pm2

## pm2的基本操作

### 启动应用进程（start a process）
```
$ pm2 start app.js --name "my-api"
$ pm2 start web.js --name "web-interface"
```

### stop the web-interface:

```
$ pm2 stop web-interface
```
### restart application
when stop an application the process hasn't disappeared yet. It's still there but in stopped status.

To restart it just do:

```
$ pm2 restart web-interface
```

### kill process 

If you want to delete the app from the PM2 process list. To do so:

```
$ pm2 delete web-interface
```

### To list all running processes:

```
$ pm2 list
```

### To get more details about a specific process:

```
$ pm2 show 0
```

### Max Memory Restart

PM2 allows to restart an application based on a memory limit.

```
$ pm2 start big-array.js --max-memory-restart 20M
```

### Monitoring CPU/Memory

PM2 gives you a simple way to monitor the resource usage of your application. You can monitor memory and cpu very easily, straight from your terminal:

```
pm2 monit
```

一个方便的监控和管理通过pm2部署的应用的在线应用是：[Discover the monitoring dashboard for PM2](https://app.keymetrics.io/#/)

### enable the cluster mode

The cluster mode allows to scale your Node.js application accross all CPUs available and to update them without any downtime

To enable the cluster mode, just pass the -i option:

```shell
# Start the maximum processes depending on available CPUs
$ pm2 start app.js -i 0

# Start the maximum processes -1 depending on available CPUs
$ pm2 start app.js -i -1

# Start 3 processes
$ pm2 start app.js -i 3
```

### Displaying logs in real-time

Displaying logs of a specified process or of all processes in real-time:

```shell
$ pm2 logs
$ pm2 logs big-api
```

### Flushing logs

This will empty all current application logs managed by PM2:

```shell
$ pm2 flush # Clear all the logs
```

### Reloading all logs

Reloading logs is specially usefull for Logrotate or any other rotating log system. You can reload logs by sending SIGUSR2 to the PM2 process. You can also reload all logs via the command line with:

```shell
$ pm2 reloadLogs
```

### Log configuration

```
$ pm2 start echo.js --merge-logs --log-date-format="YYYY-MM-DD HH:mm Z"
```

Options:

* --merge-logs                 do not postfix log file with process id
* --log-date-format <format>   prefix logs with formated timestamp
* -l --log [path]              specify entire log file (error and out are both included)
* -o --output <path>           specify out log file
* -e --error <path>            specify error log file


Note: To merge all logs into the same file set the same value for error_file, out_file.

### startup script

PM2 can generate startup scripts and configure them. PM2 is also smart enough to save all your process list and to bring back all your processes at machine restart.

```shell
$ pm2 startup
# auto-detect platform
$ pm2 startup [platform]
# render startup-script for a specific platform, the [platform] could be one of:
#   ubuntu|centos|redhat|gentoo|systemd|darwin|amazon
```

Once you have started the apps and want to keep them on server reboot do:

```
$ pm2 save
```

**Warning** It's tricky to make this feature work generically, so once PM2 has setup your startup script, reboot your server to make sure that PM2 has launched your apps!

### PM2 Development mode

PM2 comes with a handy development tool that allow you to start an application and restart it on file change:

```shell
# Start your application in development mode
# = Print the logs and restart on file change

$ pm2-dev run my-app.js
```


