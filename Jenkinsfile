pipeline {
  agent any

  environment {
    PROD_BUCKET     = 's3://sp-amp'
    REGION          = 'us-east-1'
    STATIC_FOLDER   = 'static'
    DIST_FOLDER     = 'dist'
    SLACK_TOKEN     = credentials('jenkins-pipeline-slack-token')
  }

  stages {
    stage('Start Notification') {
      steps {
        wrap([$class: 'BuildUser']) {
          sh '''
            curl -s -X "POST" -H "Content-Type: application/json" -d '{"username":"Deploy Hamster","icon_emoji":":seasonal_hamster:","channel":"dev_deployments","text":"*'${BUILD_USER_ID}'* started to deploy *'${JOB_NAME}'* to production.  <'${BUILD_URL}'console|View console logs.>"}' "https://hooks.slack.com/services/T02JD673S/$SLACK_TOKEN"
          '''
        }
      }
    }
    stage('Build') {
      steps {
        wrap([$class: 'BuildUser']) {
          sh '''
            npm install
            npm run build
          '''
        }
      }
    }
    stage('Deploy Production') {
      when {
        branch 'master'
      }
      steps {
        sh '''
          aws s3 cp "$STATIC_FOLDER" "$PROD_BUCKET/amp/unified/" --recursive --region="$REGION" --acl public-read
          aws s3 cp "$DIST_FOLDER" "$PROD_BUCKET/amp/unified/dist/" --recursive --region="$REGION" --acl public-read
          aws cloudfront create-invalidation --distribution-id E1PNN09XQ5MY9K --paths /*
        '''
      }
    }
    stage('Production Success Notification') {
      when {
        branch 'master'
      }
      steps {
        sh '''
          curl -s -X "POST" -H "Content-Type: application/json" -d '{"username":"Deploy Hamster","icon_emoji":":seasonal_hamster:","channel":"dev_deployments","attachments":[{"text":"*'${JOB_NAME}'* deployment succeeded on production!","color":"#3FCC97","mrkdwn_in":["text"]}]}' "https://hooks.slack.com/services/T02JD673S/$SLACK_TOKEN"
        '''
      }
    }
  }
}
