pipeline {
    agent any
    environment {
        CI_PROJECT_DIR = "${WORKSPACE}"
        PATH = "${WORKSPACE}/node_modules/.bin:$PATH"
    }
    stages {
        stage('Check Node Version') {
            steps {
                sh 'node -v'
                sh 'npm -v'
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'ls -la' // List files to confirm presence of package.json
                sh 'npm install --force'
            }
        }
        stage('Check Nx Version') {
            steps {
                sh 'nx --version'
                sh 'nx reset'
            }
        }
        stage('Build Backend') {
            steps {
                script {
                    sh '''
                        export PATH="$CI_PROJECT_DIR/node_modules/.bin:$PATH"
                        nx run services-sakku-mrp:build --skip-nx-cache
                    '''
                }
            }
        }
        stage('Build Frontend') {
            steps {
                script {
                    sh '''
                        export PATH="$CI_PROJECT_DIR/node_modules/.bin:$PATH"
                        nx run ui:build --skip-nx-cache
                    '''
                }
            }
        }
        stage('Modify index.html') {
            steps {
                script {
                    sh '''
                        sed -i 's|<base href="/">|<base href="/sakku_mrp_app/">|g' $CI_PROJECT_DIR/dist/packages/ui/index.html
                    '''
                }
            }
        }
        stage('Transfer Build Files') {
            steps {
                sshagent(credentials: ['2']) { // Use the correct credentials ID here
                    sh '''
                        ssh root@139.59.79.77 "rm -rf /var/www/html/gate_app/*"
                        ssh root@139.59.79.77 "rm -rf /var/www/html/gate_pass/packages/services"
                        scp -r $CI_PROJECT_DIR/dist/packages/ui/* root@139.59.79.77:/var/www/html/gate_app
                        scp -r $CI_PROJECT_DIR/dist/packages/services root@139.59.79.77:/var/www/html/gate_pass/dist/packages
                    '''
                }
            }
        }
        stage('Restart Services with PM2') {
            steps {
                sshagent(credentials: ['2']) { // Use the correct credentials ID here
                    sh '''
                        ssh root@139.59.79.77 <<EOF
pm2 restart sakku_mrp_3337
pm2 save
EOF
                    '''
                }
            }
        }
    }
    post {
        success {
            script {
                def startTime = currentBuild.getStartTimeInMillis()
                def endTime = System.currentTimeMillis()
                def duration = (endTime - startTime) / 1000
                // Send success email
                emailext(
                    to: 'saikumarvardhi7799@gmail.com, rajud@schemaxtech.com, arunkumars@schemaxtech.com',
                    subject: "SUCCESS: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                    body: """Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' was successful.
Start Time: ${new Date(startTime)}
End Time: ${new Date(endTime)}
Duration: ${duration} seconds
Check console output at ${env.BUILD_URL} to view the results."""
                )
            }
        }
        failure {
            script {
                def logFile = "${WORKSPACE}/log"
                def logContent = ""
                if (fileExists(logFile)) {
                    logContent = readFile(logFile).take(1000)
                } else {
                    logContent = "Log file not found."
                }
                // Send failure email
                emailext(
                    to: 'saikumarvardhi7799@gmail.com, rajud@schemaxtech.com, arunkumars@schemaxtech.com',
                    subject: "FAILURE: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                    body: """Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' failed.
Error Log:
${logContent}
Check console output at ${env.BUILD_URL} to view the results."""
                )
            }
        }
    }
}