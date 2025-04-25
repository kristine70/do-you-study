# do-you-study

## Feature checklist

- add one memeber to the db when joining.
- delete one member from db when leaving.
- update the time into db when voice state change.
- send one the message to the announcement channel about one list who haven't been in study room for 7 days
- send another message to the management channel about 14 days inactive members
- do not memtion study star

## Deploy to the Cloud Server

### AWS ECS

1. log in the EC2 page: [link](https://us-west-1.console.aws.amazon.com/ec2/home?region=us-west-1#Home>:)
2. Create an instances: [link](https://us-west-1.console.aws.amazon.com/ec2/home?region=us-west-1#Instances:)
3. Connect to the instance through SSH, read the instruction at AWS ssh connection tab.

### Google Cloud

1. just connect VM using browser ssh.
2. set up local ssh connection

```bash
brew install --cask google-cloud-sdk
gcloud init ## select the project if only have one. do not change zone.
gcloud compute ssh USERNAME@INSTANCE_NAME --zone=us-central1-c ## may change the name and the zone
gcloud compute config-ssh ## set up a ssh config for vscode connection
## remember to change ~/.ssh/config file and add User current name
```

### Set Up Environment

Download nvm, node, git and pm2

```bash
# Install Node and pm2
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
nvm install 22
node -v
nvm install-latest-npm
npm install pm2 -g
# Install Git
sudo apt update
sudo apt install git-all
```

set up github ssh, paste to github, and clone the repo

```bash
cd ~/.ssh
ssh-keygen -o -t rsa -C "NAME_EXAMPLE@outlook.com"
cat id_rsa.pub # paste to github
cd
git clone git@github.com:kristine70/do-you-study.git
```

1. `npm install`
2. download mongoDB Google Search: debian mongodb download
3. start mongoDB `sudo systemctl start mongod`
4. connect mongoDB with ssh and mongoDB compass
5. migrate db
6. ssh vscode to the cloud server (check ~/.ssh/config file)
7. add .env file
8. `npm run server`
9. `pm2 start 'npm run server' --name study-bot`
10. `pm2 logs`
