import { Store } from './Store'

function NotSerializable(): string { 
	return 'test'
}

let obj = { id: 5, name: 'Pomme' }
let objWithFunction = { id: 18, name: 'Poire', notSuspisciousAtAll: NotSerializable}

let store = new Store();
store.add('user', 15);
store.add('user.id', 15);
store.add('user.address.street', '15 rue des tests');
store.add('user.address.city', 'Paris');
store.add('user.address.zip', ['75001', '75002', '75003', '75004', '75005']);
store.add('user.name', 'Robert');
store.add('user.name', 'Thierry');
//store.add('user.test',  NotSerializable); // This throw a compilation error
store.add('obj', obj);
//store.add('obj', objWithFunction); // Throw another compilation error
store.list();
console.log(store.get('user.id'));
console.log(store.get('user.firstname'));
console.log(store.get('user.address.zip'));
console.log(store.toJson());
var json = '{ "name": "John Doe", "language": { "name": "en", "level": 5 } }';
store.fromJson(json);
console.log(store.get("language.name"));
store.list();
console.log(store.toJson());
