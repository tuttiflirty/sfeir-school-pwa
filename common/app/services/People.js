export class PeoplesService {
  constructor() {
    const SERVER = 'http://localhost:3000';
    this.API_URL = `${SERVER}/api/people`;
    this.peoples = null;
    this.peopleMap = new Map();
    this.hasRequestPending = false;
    this.networkPromise = this.initialize();
  }

  async initialize() {
    this.hasRequestPending = true;
    try {
      const response = await fetch(this.API_URL);
      const data = await response.json();
      this.hasRequestPending = false;
      if (this.peoples) {
        //Replace this.peoples
        Array.prototype.splice.apply(this.peoples, [0, this.peoples.length].concat(data));
      } else {
        this.peoples = data;
      }
    } catch (e) {
      console.error(e);
      this.peoples = [];
    }
  }

  onResult() {
    this.peoples.forEach(people => {
      people.name = people.firstname + ' ' + people.lastname;
      this.peopleMap.set(people.email, people);
    });
    return this.peoples;
  }

  async getPeoples() {
    await this.networkPromise;
    return this.onResult();
  }

  getPeopleById(id) {
    return this.peopleMap.get(id);
  }

  async updatePeope(people) {
    return await fetch(`${this.API_URL}/${people.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(people)
    });
  }

  getCollab(email) {
    var response = { isManager: false, collab: [] };
    angular.forEach(
      this.peopleMap,
      function(value, key) {
        if (value.manager === email) {
          response.isManager = true;
          response.collab.push(key);
        }
      },
      response
    );
    return response;
  }
}
