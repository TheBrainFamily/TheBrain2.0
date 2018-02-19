const BranchHelper = require('./branchHelper')

describe('BranchHelper', () => {
  describe('constructor', () => {
    it('should set `buildVersionLabel` when `buildVersionLabel` param is passed', () => {
      const versionLabel = 'new-label'

      const branchHelper = new BranchHelper(versionLabel)

      expect(branchHelper.buildVersionLabel).toEqual(versionLabel)
    })
    it('should set `buildVersionLabel` from system env `BUILD_VERSION_LABEL` when no `buildVersionLabel` param is passed', () => {
      const versionLabel = 'env-label'
      process.env.BUILD_VERSION_LABEL = versionLabel

      const branchHelper = new BranchHelper()

      expect(branchHelper.buildVersionLabel).toEqual(versionLabel)
    })
    it('should set empty `protectedBranches` array', function () {
      const branchHelper = new BranchHelper()

      expect(branchHelper.protectedBranches).toEqual([])
    })
  })
  describe('addProtectedBranch', () => {
    it('should add branchName to protected branches', () => {
      const branchName = 'master'
      const branchHelper = new BranchHelper()

      branchHelper.addProtectedBranch(branchName)

      expect(branchHelper.protectedBranches).toEqual([branchName])
    })
  })
  describe('getBranchVersionLabel', () => {
    it('should return branch version label from stackName param', () => {
      const branchVersionLabel = 'my-custom-label'
      const stackName = `thebrain-server-${branchVersionLabel}-dev`
      const branchHelper = new BranchHelper()

      expect(branchHelper.getBranchVersionLabel(stackName)).toEqual(branchVersionLabel)
    })
  })
  describe('updateProtectedBranches', () => {
    it('should change protected branches name to truncated name with truncated md5 hash of branch name', () => {
      const expectedBranchesVersionLabel = [
        'master-c963080',
        'longnametobetr-ec5a04e'
      ]
      const branchHelper = new BranchHelper()
      branchHelper.addProtectedBranch('master')
      branchHelper.addProtectedBranch('longnametobetruncated')

      branchHelper.updateProtectedBranches()

      expect(branchHelper.protectedBranches).toEqual(expectedBranchesVersionLabel)
    })
  })
  describe('isProtectedBranch', () => {
    it('should return true if branch is protected', () => {
      const branchVersionLabel = 'master-c963080'
      const branchHelper = new BranchHelper()
      branchHelper.addProtectedBranch('master')
      branchHelper.updateProtectedBranches()

      expect(branchHelper.isProtectedBranch(branchVersionLabel)).toEqual(true)
    })
    it('should return false if branch is not protected', () => {
      const branchVersionLabel = 'develop-107d38c'
      const branchHelper = new BranchHelper()
      branchHelper.addProtectedBranch('master')
      branchHelper.updateProtectedBranches()

      expect(branchHelper.isProtectedBranch(branchVersionLabel)).toEqual(false)
    })
  })
})
