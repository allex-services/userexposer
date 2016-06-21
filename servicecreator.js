function createUserExposerService(execlib, ParentService) {
  'use strict';
   var execSuite = execlib.execSuite,
      registry = execSuite.registry,
      taskRegistry = execSuite.taskRegistry;


  function factoryCreator(parentFactory) {
    return {
      'service': require('./users/serviceusercreator')(execlib, parentFactory.get('service')),
      'user': require('./users/usercreator')(execlib, parentFactory.get('user')) 
    };
  }

  function UserExposerService(prophash) {
    ParentService.call(this, prophash);
  }
  
  ParentService.inherit(UserExposerService, factoryCreator);
  
  UserExposerService.prototype.__cleanUp = function() {
    ParentService.prototype.__cleanUp.call(this);
  };

  UserExposerService.prototype.obtainOuterSink = function () {
    this.obtainUsersSink();
  };

  UserExposerService.prototype.onUsersSink = function (userssink) {
    if (!userssink) {
      return;
    }
    this.acquireUserServiceSinkTask = taskRegistry.run('acquireUserServiceSink',{
      sink: userssink,
      cb: this.setOuterSink.bind(this),
      propertyhash: {nochannels:true}
    });
  };

  /* all can be done from onOOBData of ParentService (SinkExposerService)
  UserExposerService.prototype.setOuterSink = function (sink) {
    ParentService.prototype.setOuterSink.call(this, sink);
    console.log('now UserExposerService has to handle setOuterSink', sink.localSinkNames, sink.remoteSinkNames);
    sink.localSinkNames.forEach(this.cloneSubSink.bind(this));
  };
  */

  return UserExposerService;
}

module.exports = createUserExposerService;
