function Diary() {
	that = this;
}

Diary.prototype.setup = function(callback) {

	// Configura o BD
	this.db = window.openDatabase("diary", 1, "diary", 1000000);
	this.db.transaction(this.initDB, this.dbErrorHandler, callback);

}

// Handle de erro pra evitar crash
Diary.prototype.dbErrorHandler = function(e) {
	console.log('DB Error');
	console.dir(e);
}

// Inicializa a estrutura do BD
Diary.prototype.initDB = function(t) {
	t.executeSql('create table if not exists diary(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, body TEXT, image TEXT, published DATE)');
}

Diary.prototype.getEntries = function(start,callback) {
	console.log('Running getEntries');
	if(arguments.length === 1) callback = arguments[0];

	this.db.transaction(
		function(t) {
			t.executeSql('select id, title, body, image, published from diary order by published desc',[],
				function(t,results) {
					callback(that.fixResults(results));
				},this.dbErrorHandler);
		}, this.dbErrorHandler);

}

Diary.prototype.getEntry = function(id, callback) {

	this.db.transaction(
		function(t) {
			t.executeSql('select id, title, body, image, published from diary where id = ?', [id],
				function(t, results) {
					callback(that.fixResult(results));
				}, this.dbErrorHandler);
			}, this.dbErrorHandler);

}

Diary.prototype.saveEntry = function(data, callback) {
console.dir(data);
	this.db.transaction(
		function(t) {
			t.executeSql('insert into diary(title,body,image,published) values(?,?,?,?)', [data.title, data.body, data.image, new Date().getTime()],
			function() { 
				callback();
			}, this.dbErrorHandler);
		}, this.dbErrorHandler);
}

// Transforma registros em arrays
Diary.prototype.fixResults = function(res) {
	var result = [];
	for(var i=0, len=res.rows.length; i<len; i++) {
		var row = res.rows.item(i);
		result.push(row);
	}
	return result;
}

// Retorna um objeto em vez de array, que por algum motivo dá erro se não for assim.
Diary.prototype.fixResult = function(res) {
	if(res.rows.length) {
		return res.rows.item(0);
	} else return {};
}