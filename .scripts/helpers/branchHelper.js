const {generateMd5Hash} = require('./utilitiesHelper')

class BranchHelper {
  constructor (buildVersionLabel) {
    this.buildVersionLabel = buildVersionLabel || process.env.BUILD_VERSION_LABEL
    this.protectedBranches = []
  }

  addProtectedBranch(branchName) {
    this.protectedBranches.push(branchName)
  }

  getBranchVersionLabel (stackName) {
    return stackName.replace(/^thebrain-server-/, '').replace(/-dev$/, '')
  }

  updateProtectedBranches () {
    this.protectedBranches = this.protectedBranches.map(protectedBranch => {
      const truncatedBranchName = protectedBranch.substr(0, 14)
      const md5Hash = generateMd5Hash(protectedBranch)
      return `${truncatedBranchName}-${md5Hash}`
    })
  }

  isProtectedBranch (branchVersionLabel) {
    return this.protectedBranches.indexOf(branchVersionLabel) > -1 || branchVersionLabel === this.buildVersionLabel
  }
}

module.exports = BranchHelper
