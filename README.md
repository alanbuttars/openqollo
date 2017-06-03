OpenQollo
=====

<a href="http://phonegap.com">PhoneGap</a> has some great documentation, but how much can you learn from little code snippets? That's why I created OpenQollo, a simple albeit full-featured image-sharing application that includes some typical user operations you would include in a mobile app &mdash; registration, login, messaging, and interactions with the file system and camera.

## Documentation
A summary of the development process for this app is documented in my blog. Enjoy:

* <a href="http://alanbuttars.com/blog.php?post=1">PhoneGap Part 1: OpenQollo's Login and Register</a>
* <a href="http://alanbuttars.com/blog.php?post=2">PhoneGap Part 2: Authenticating REST calls</a>
* <a href="http://alanbuttars.com/blog.php?post=3">PhoneGap Part 3: Angular UI Router</a>
* <a href="http://alanbuttars.com/blog.php?post=4">PhoneGap Part 4: Reading contact lists and using the Web SQL database</a>
* <a href="http://alanbuttars.com/blog.php?post=5">PhoneGap Part 5: MVC with Angular JS</a>
* <a href="http://alanbuttars.com/blog.php?post=6">PhoneGap Part 6: Using the Cordova camera and file transfer plugins</a>
* <a href="http://alanbuttars.com/blog.php?post=7">PhoneGap Part 7: Downloading with the file transfer plugin</a>

## Installation
#### 1. Install the codebase
```shell
sudo npm install -g phonegap
git clone git@github.com:alanbuttars/openqollo.git
```

#### 2. Deploy the client
```shell
cd openqollo/client
phonegap serve
```

This will deploy the client application to a local address:

```shell
[phonegap] starting app server...
[phonegap] listening on 10.0.0.11:3000
[phonegap] 
[phonegap] ctrl-c to stop the server
[phonegap] 
```

#### 3. Download the PhoneGap Developer app
![Install the PhoneGap Developer app](http://alanbuttars.com/img/install_1_phonegap_google_play.png)

#### 4. Open the PhoneGap Developer app and enter the IP address in step 2.
![Enter the IP into the PhoneGap Developer app](http://alanbuttars.com/img/install_2_phonegap_ip.png)

#### 5. After entering "Connect", the OpenQollo app will open.
![View the OpenQollo app](http://alanbuttars.com/img/install_3_app_login.png)

