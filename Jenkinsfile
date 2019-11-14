pipeline {
  agent any
  
  tools {
    jdk 'jdk8'
  }

  options { timestamps() }

  // Init
  stages {
    stage('Init') {
      steps {
        script {
          imageName = "neverpile-eureka-web-client:${env.BUILD_ID}"
        }
      }
    }

    // Build
    stage('Build') {
      options {
        timeout(time: 30, unit: 'MINUTES')
      }
      steps {
        nodejs(nodeJSInstallationName: 'nodejs-lts', configId: 'default-npm-configuration') {
          sh 'npm config set loglevel verbose'
          sh 'npm install'
          sh 'npm config ls'
          sh 'npm run build'
        }
      }
    }

    // Test
    stage('Test') {
      steps {
        echo 'Testing'
        // TODO
      }
    }

    stage ('Webjar Build') {
      when {
        branch 'master'
      }
      options {
          timeout(time:1, unit:'MINUTES')
      }
      steps {
          withMaven(
              maven: 'maven3.5',
              // Maven settings.xml file defined with the Jenkins Config File Provider Plugin
              // Maven settings and global settings can also be defined in Jenkins Global Tools Configuration
              mavenSettingsConfig: 'mavenSettings') {
            // Run the maven build
            sh "mvn clean deploy "
          }
      }
    }

    // Docker Build
    /*
    stage('Docker-Build') {
      agent {
        node {
          label ''
          // customWorkspace "/var/jenkins_home/workspace/neverpile-eureka-client${BRANCH_NAME}"
        }
      }
      options {
        timeout(time: 5, unit: 'MINUTES')
      }
      when { branch 'master' }
      steps {
        script {
          docker.withRegistry('https://registry.container.levigo.de:5000', 'jenkins-registry-user') {
            neverpileTestContainer = docker.build(imageName, ".")
            neverpileTestContainer.push()
          }
        }
      }
    }*/ 
  }

  post {
    success {
      script {
        if (env.BRANCH_NAME == 'master')
          slackSend channel: '#eureka_client',
            color: 'good',
            message: "The pipeline ${currentBuild.fullDisplayName} completed successfully on branch master."
      }
    }
    fixed {
      echo 'Build (wieder) erfolgreich'
      slackSend channel: '#eureka_client',
        color: 'good',
        message: "The pipeline ${currentBuild.fullDisplayName} completed successfully."
    }
    unstable {
      echo 'Build instabil'
      slackSend channel: '#eureka_client',
        color: '#DDDD00',
        message: "The pipeline ${currentBuild.fullDisplayName} is unstable."
    }
    regression {
      echo 'Build fehlgeschlagen'
      slackSend channel: '#eureka_client',
        color: '#FF0000',
        message: "The pipeline ${currentBuild.fullDisplayName} failed."
    }
    cleanup {
      echo 'One way or another, I have finished'
      dir("${WORKSPACE}@tmp") { deleteDir() }
    }
  }
}
