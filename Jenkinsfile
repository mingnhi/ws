pipeline {
    agent any

    environment {
        REGISTRY = "docker.io/${DOCKER_USERNAME}"    // Docker registry
        IMAGE_NAME = "server-lms-net"                // Tên image
        SERVER_HOST = "188.166.208.144"                // IP production server
        SERVER_USER = "root"                         // User SSH vào server
        BRANCH = "main"
    }
    stages {

        stage('Checkout') {
            steps {
                echo "Checkout code từ GitHub..."
                checkout([$class: 'GitSCM',
                    branches: [[name: "*/${BRANCH}"]],
                    userRemoteConfigs: [[
                        url: 'https://github.com/mingnhi/ws.git',
                        credentialsId: 'github-pat'
                    ]]
                ])
            }
        }

        stage('Docker Build') {
            steps {
                echo "Build Docker image..."
                withCredentials([usernamePassword(credentialsId: 'dockerhub-cred',
                    usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                    docker build -t docker.io/$DOCKER_USER/$IMAGE_NAME:latest .
                    '''
                }
            }
        }

        stage('Push Docker Hub') {
            steps {
                echo " Push image lên Docker Hub..."
                withCredentials([usernamePassword(credentialsId: 'dockerhub-cred',
                    usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                    docker push docker.io/$DOCKER_USER/$IMAGE_NAME:latest
                    docker logout
                    '''
                }
            }
        }

        stage('Deploy to Server') {
            steps {
                echo "Triển khai ứng dụng lên server..."
                withCredentials([
                    usernamePassword(credentialsId: 'dockerhub-cred',
                        usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS'),
                    string(credentialsId: 'db-conn', variable: 'DB_CONN'),
                    file(credentialsId: 'docker-compose-file', variable: 'DOCKER_COMPOSE_PATH')
                ]) {
                    sshagent (credentials: ['server-ssh-key']) {
                        sh '''
                        echo "Copy docker-compose.yml sang server..."
                        scp -o StrictHostKeyChecking=no $DOCKER_COMPOSE_PATH $SERVER_USER@$SERVER_HOST:/root/project/docker-compose.yml

                        echo "Deploy qua SSH..."
                        ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_HOST "
                          set -e
                          cd /root/project
                          
                          echo 'DB_CONNECTION_STRING=$DB_CONN' > .env
                          
                          echo '$DOCKER_PASS' | docker login -u $DOCKER_USER --password-stdin
                          docker compose --env-file .env pull
                          docker compose --env-file .env down
                          docker compose --env-file .env up -d
                          docker image prune -f
                          docker logout
                        "
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo ' Triển khai thành công!'
        }
        failure {
            echo ' Có lỗi xảy ra trong quá trình build hoặc deploy!'
        }
    }
}
