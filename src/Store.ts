type JSONValue =
    | string
    | number
    | boolean
	| null
    | JSONObject
    | JSONArray;

interface JSONObject {
    [x: string]: JSONValue;
}

interface JSONArray extends Array<JSONValue> { }


export class Store {

	private data: JSONObject
	
	constructor() {
		this.data = {}
	}
	
	public toJson(): string {
		return JSON.stringify(this.data)
	}
	
	/*
	* This function overrides the current data to a dataset from a JSON string
	*/
	public fromJson(json: string): void {
		let obj = JSON.parse(json)
		if (obj !== undefined)
			this.data = obj;
		else {
			throw new Error('Error: Invalid JSON !')
		}
	}
	
	/*
	* Add a new Key/value pair. Key can be nested
	*/
	public add(key: string, value: JSONValue): void {
		// In theory, JSONValue type ensure that value is serializable.
		if (!this.isSerializable(value)) {
			throw new Error('Error: Value is not serializable !')
		}
		let keyArray = key.split('.')
		this.assignValueToNestedKey(this.data, keyArray, value, 0)
	}
	
	/*
	* Get a stored value based on key
	*/
	public get(key: string): JSONValue {
		let keyArray = key.split('.')
		return this.getNestedKeyValue(this.data, keyArray, 0)
	}
	
	/*
	* List all keys/values currently stored
	* The list is displayed using console.log
	*/
	public list(): void {
		this.listObjectKeys(this.data, "")
	}
	
	/*
	* Recursively list a JSONObject's nested keys
	*/
	private listObjectKeys(dataContainer: JSONObject, currentKey: string): void {
		if (currentKey != "")
			currentKey += "."
		for (var key in dataContainer) {
			if (typeof dataContainer[key] === 'object') {
				this.listObjectKeys(dataContainer[key] as JSONObject, currentKey+key)
			}
			else {
				console.log("["+currentKey+key+"] : "+dataContainer[key])
			}
		}
	}
	
	/*
	* Recursively get a JSONValue
	* If the value doesn't exist, return null
	*/
	private getNestedKeyValue(dataContainer: JSONObject, keyArray: Array<string>, i: number): JSONValue {
		if (i == keyArray.length - 1) {
			return dataContainer[keyArray[i]]
		}
		if (typeof dataContainer[keyArray[i]] === 'undefined' ) {
			return null
		}
		return this.getNestedKeyValue(dataContainer[keyArray[i]] as JSONObject, keyArray, i + 1)
	}
	
	/*
	* Recursively assign a value to a nested key
	* Some data may be lost 
	*/
	private assignValueToNestedKey(dataContainer: JSONObject, keyArray: Array<string>, value: JSONValue, i: number): void {
		if (i == keyArray.length - 1) {
			dataContainer[keyArray[i]] = value;
			return
		}
		// Here we can loose some data if dataContainer[keyArray[i]] !== undefined.
		if (typeof dataContainer[keyArray[i]] !== 'object' ) { 
			dataContainer[keyArray[i]] = {}
		}
		this.assignValueToNestedKey(dataContainer[keyArray[i]] as JSONObject, keyArray, value, i + 1)
		
	}
	
	private isPlain(obj: any): boolean {
		if (typeof obj === 'undefined' ||
			typeof obj === 'boolean' ||
			typeof obj === 'number' ||
			typeof obj === 'string' ||
			Array.isArray(obj)) {
			return true
		}
		return false
	}
	
	private isSerializable(obj: any): boolean {
		if (this.isPlain(obj))
			return true
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				if (typeof obj[key] === "object") {
					if (!this.isSerializable(obj[key])) {
						return false;
					}
				}
				if (!this.isPlain(obj[key])) {
					return false
				}
			}
		}
		return true
	}
}