class ItemData {
    public id: string;
    public name: string;
    public children:  Array<ItemData>;
    constructor(id: string, name: string, children: Array<ItemData>) {
        this.id = id;
        this.name = name;
        this.children = children;
    }
}

class DataHelper {

    static parse (jsonString: string) : any  {
      let result = null;
      try {
          let jsonData = JSON.parse(jsonString);
          result = jsonData;
      } catch (error) {}

      return result;
    }


    static convertFromJson (jsonData: Array<any>) : Array<ItemData> {
      let result = [];
      for (let item of jsonData) {
          let { id, name, children } = item,
              instance = new ItemData(
                  id,
                  name,
                  DataHelper.convertFromJson(children)
              );
          result.push(instance)
      }

      return result;
    }


    static convertFromString(jsonString: string): Array<ItemData> {
        let result = [],
            jsonData = DataHelper.parse(jsonString);
            if (jsonData) {
              result = DataHelper.convertFromJson(jsonData);
            }

        return result;
    }

    static getAttribute(data: Array<ItemData>, attribute: string) : Array <string> {
        let result = [];
        for (let item of data) {
            result.push(item[attribute]);
            result = [
              ...result,
              ...DataHelper.getAttribute(item.children, attribute)
            ];
        }

        return result;
    }
}

class DataManager {
  public helper;
  private config = {
    url: 'http://my.server.com/data/path',
    params: {
        access_token: 'some_key'
    }
  };
  constructor(helper: DataHelper) {
      this.helper = helper;
  }

  getData (asJson: boolean = true) : Promise<any> {
    const data = [
        {
            id: '1',
            name: 'first',
            children: []
        },
        {
            id: '2',
            name: 'second',
            children: [
                {
                    id: '2.1',
                    name: 'second.first',
                    children: []
                }
            ]
        }
    ];
    return new Promise (resolve => {
          let result = asJson ? data : this.helper.parse(data);
          if (!result) {
            reject(new Error('Data not valid'));
          }
          resolve(result);
    });
  }

  getAttribute (data: any, attribute: string) : Array<ItemData> {
    let validData = typeof data == 'string'
        ? DataHelper.convertFromString(data)
        : DataHelper.convertFromJson(data);
    return this.helper.getAttribute(validData, attribute);
  }
}


function main () : void {
  let instance = new DataManager(DataHelper),
      promises = [
        instance.getData().then(jsonData => instance.getAttribute(jsonData, 'id')),
        instance.getData(false).then(stringData => instance.getAttribute(stringData, 'name'))
      ];

      Promise.all(promises)
        .then((results) => {
            console.log(results);
        });
}

main();
