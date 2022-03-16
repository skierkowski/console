<!--
title: Using Serveless Console
menuText: Using Serveless Console
description: A guide to using Serverless Console UI
menuOrder: 1
-->

# Getting Started
Serverless Console provides an easy to use User Interface for 
monitoring your Serverless architectures. We automatically
recongize patterns by observing [Traces](traces.md) sent by our
[Serverless Runtime instrumentation](../concepts/index.md).


To start using the Console to monitor your apps, you'll need to
signup, and create your own organization. 
```

## Creating a user and Organization 
If you're new to Serveless, you'll need to sign up and create an 
Orginization (Org) on [Serverless Dashboard](https://app.serverless.com) 
to start using Serverless Console. An Organization is treated as a 
tenant across Serverless products and data is not able to be shared 
across Organization. 



```text	
serverless \
  --org=<your-org-name> \
  --name=console-http-api \
  --template=aws-node-express-api \
  --console
```

**Setup a local AWS Access Key**
If you have not used framework to deploy to you'll
need to configure a Cloud Provider, you can follow along
with the onboarding prompts or do the following.


1. [Create an AWS access key](https://www.youtube.com/watch?v=KngM5bfpttA)
(AWS Console Access required).
1. Configure your Credentials locally.

```text
serverless config credentials \
  --provider aws \
  --key AKIAIOSFODNN7EXAMPLE \
  --secret wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

**Start Deploying**
Once you have setup your organization and access keys
you'll be ready to deploy your first app instrumented
for console. Follow the prompts from the onboarding
command or change into your project folder and run
the deploy command.

```text
cd my-project
serverless deploy
```


## Adding More Team Members

Console currently supports the following basic roles which 
are shared across your org. 

* **Owner** - Owner of the account. Can add other admins and 
contributors. Only one owner per account can be present.
* **Admin** - Admins can add other users, deploy apps, and use 
all of console.
* **Contributor** - Contributors can use all of console but 
can not add other users.

*Note: adding users requires a valid Enterprise subscription
or a Free Trial. Please contact sales@serverless.com for details.*
