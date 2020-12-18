// def REPO_URL = 'http://dev.gomoretech.com/gitlab/gomore/newretail-backoffice.git'
def VERSION = ''
def HARBOR = 'harbor.5jstore.com:8020'

// get version from ./config/prod.env.js
def getPrjVersion() {
    def contents = readFile file: "./config/prod.env.js", encoding: "utf-8"
    def version = (contents =~ /(?m)VERSION\:(.*)/)[0][1].replaceAll("'", "").replaceAll("\"", "").trim()
    return version
}

pipeline {
    agent any
    parameters {
        //  gitParameter(branch: '',
        //     name: 'BRANCH',
        //     branchFilter: 'origin/(.*)',
        //     defaultValue: 'master',
        //     description: '请选择要编译的分支',
        //     quickFilterEnabled: false,
        //     sortMode: 'ASCENDING_SMART',
        //     tagFilter: '*',
        //     type: 'PT_BRANCH_TAG')
        booleanParam(
            name: 'RELEASE',
            defaultValue: false,
            description: '是否要发布版本，只有版本发布时才勾选，日常编译不要勾选')
        // booleanParam(
        //     name: 'QUICK_BUILD',
        //     defaultValue: true,
        //     description: '是否快速构建。快速构建将不会安装新的依赖包，首次编译或有新的依赖包加入请不要勾选此项')
    }
    options {
        buildDiscarder(logRotator(
            numToKeepStr: '7',
            artifactNumToKeepStr: '7'
            // daysToKeepStr: history is only kept up to this days.
            // artifactDaysToKeepStr: artifacts are only kept up to this days.
            )
        )
    }
    stages {

        // stage('Checkout') {
        //     steps {
        //         echo "start pipeline: ${params.BRANCH}"
        //         git url:"${REPO_URL}", branch:"${params.BRANCH}"
        //     }
        // }

        stage('Compile') {
            // agent {
            //     docker {
            //         image 'node:6-alpine'
            //         args '-p 3000:3000'
            //         reuseNode true
            //     }
            // }
            steps {

                script {
                    PRJ_VERSION = getPrjVersion()
                    echo "current version is ${PRJ_VERSION}"
                    // if (!params.QUICK_BUILD) {
                    //     // install dependencies
                    //     sh "npm install --unsafe-perm --save-dev"
                    // }
                }

                // build project
                sh "npm install --unsafe-perm && npm run build"
            } 
        }
        
        stage('Archive') { 
            steps {                
                echo "ready to achive coffee-admin-${PRJ_VERSION}.zip!"
                sh "rm -rf coffee-admin*.zip"
                zip zipFile: "coffee-admin-${PRJ_VERSION}.zip", archive: true, dir: './dist'
            } 
        }

        stage('Build images') {
            steps {
                echo "ready to build coffee-admin:${PRJ_VERSION} image"
                sh "docker build -t ${HARBOR}/newretail/coffee-admin:${PRJ_VERSION} -f ./docker/dockerfile ."
            }                
        }

        stage('Push images') { 
            steps {
                echo "ready to push coffee-admin:${PRJ_VERSION} image to harbor"
                sh "docker login -u admin -p WMdigit123 http://${HARBOR}"
                sh "docker push ${HARBOR}/newretail/coffee-admin:${PRJ_VERSION}"
                }
            } 
    } 
} 
