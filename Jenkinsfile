pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Jeremie-PARANT/api_crisiview.git'
            }
        }

        stage('Install & Test') {
            agent {
                docker {
                    image 'node:20'
                    reuseNode true
                }
            }
            steps {
                sh 'npm install'
                sh 'npm test'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarQube' 
                    
                    withSonarQubeEnv('sonar') {
                        // On retire le point (.) pour sonar.sources si le fichier properties existe déjà
                        // OU on écrase proprement les exclusions pour inclure les tests
                        sh "${scannerHome}/bin/sonar-scanner \
                            -Dsonar.projectKey=api-crisiview \
                            -Dsonar.sources=. \
                            -Dsonar.tests=__tests__ \
                            -Dsonar.exclusions=**/node_modules/**,**/__tests__/**"
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build') {
            steps {
                // Cette commande s'exécute sur l'agent (ta VM), pas dans un conteneur
                sh 'docker build -t api-crisiview .'
            }
        }
        stage('Push Docker Image') {
            steps {
                script {
                    withDockerRegistry([credentialsId: 'dockerhub', url: '']) {
                        sh '''
                            docker tag api-crisiview enorkil/api-crisiview:latest
                            docker push enorkil/api-crisiview:latest
                        '''
                    }
                }
            }
        }
    }
}