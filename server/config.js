module.exports = {
  	ip:"http://86.7.75.141",
  	port:1337,
	requiredXpToNextLevel:function(currentLevel){
		return 100*(Math.pow(1.08,currentLevel));
	},
	healthModifierFromLevel:function(currentLevel){
		return 100 + (currentLevel*50);
	}	
};
