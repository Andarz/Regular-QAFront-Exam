const baseUrl = 'http://localhost:3030/';

let user = {
    email: "",
    password: "123456"
};

let token = "";
let userId = "";
let lastCreatedItemId = "";

let album = {
    name: "",
    artist: "Pink Floyd",
    description: "",
    genre: "Random genre",
    imgUrl: "/images/pinkFloyd.jpg",
    price: "15.25",
    releaseDate: "29 June 2024"
};

QUnit.config.reorder = false;

QUnit.module("User Functionality", () => {
    QUnit.test("Register Testing", async (assert) => {
        //arrange
        let path = 'users/register';
        let random = Math.floor(Math.random() * 10000);
        user.email = `abv_${random}@abv.bg`;

        //act
        let response = await fetch(baseUrl + path, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        let json = await response.json();
        console.log(json);

        //assert
        assert.ok(response.ok, "Response is OK");

        assert.ok(json.hasOwnProperty('email'), 'email exists');
        assert.equal(json['email'], user.email, 'expected email');
        assert.strictEqual(typeof json.email, 'string', 'email is a correct type');

        assert.ok(json.hasOwnProperty('password'), 'password exists');
        assert.equal(json['password'], user.password, 'expected password');
        assert.strictEqual(typeof json.password, 'string', 'password is a correct type');

        assert.ok(json.hasOwnProperty('_createdOn'), '_createdOn exists');
        assert.strictEqual(typeof json._createdOn, 'number', '_createdOn is a correct type');

        assert.ok(json.hasOwnProperty('_id'), '_id exists');
        assert.strictEqual(typeof json._id, 'string', '_id is a correct type');

        assert.ok(json.hasOwnProperty('accessToken'), 'accessToken exists');
        assert.strictEqual(typeof json.accessToken, 'string', 'accessToken is a correct type');
    });

    QUnit.test("Login Testing", async (assert) => {
        //arrange
        let path = 'users/login';
        //act
        let response = await fetch(baseUrl + path, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        let json = await response.json();

        //assert
        assert.ok(response.ok, "Response is OK");

        assert.ok(json.hasOwnProperty('email'), 'email exists');
        assert.equal(json['email'], user.email, 'expected email');
        assert.strictEqual(typeof json.email, 'string', 'email is a correct type');

        assert.ok(json.hasOwnProperty('password'), 'password exists');
        assert.equal(json['password'], user.password, 'expected password');
        assert.strictEqual(typeof json.password, 'string', 'password is a correct type');

        assert.ok(json.hasOwnProperty('_createdOn'), '_createdOn exists');
        assert.strictEqual(typeof json._createdOn, 'number', '_createdOn is a correct type');

        assert.ok(json.hasOwnProperty('_id'), '_id exists');
        assert.strictEqual(typeof json._id, 'string', '_id is a correct type');

        assert.ok(json.hasOwnProperty('accessToken'), 'accessToken exists');
        assert.strictEqual(typeof json.accessToken, 'string', 'accessToken is a correct type');

        token = json['accessToken'];
        userId = json['_id'];
        sessionStorage.setItem('event-user', JSON.stringify(user));
    });
});

QUnit.module("Album Functionality", () => {
    QUnit.test("Get All Albums Testing", async (assert) => {
        //arrange
        let path = 'data/albums';
        let queryParam = '?sortBy=_createdOn%20desc&distinct=name';

        //act
        let response = await fetch(baseUrl + path + queryParam);
        let json = await response.json();

        //assert
        assert.ok(response.ok, "Response is OK");
        assert.ok(Array.isArray(json), 'Response is Array');

        json.forEach(json => {
            assert.ok(json.hasOwnProperty('_ownerId'), '_ownerId exists');
            assert.strictEqual(typeof json._ownerId, 'string', 'Field has a correct type');

            assert.ok(json.hasOwnProperty('name'), 'name exists');
            assert.strictEqual(typeof json.name, 'string', 'Field has a correct type');

            assert.ok(json.hasOwnProperty('artist'), 'artist exists');
            assert.strictEqual(typeof json.artist, 'string', 'Field has a correct type');

            assert.ok(json.hasOwnProperty('genre'), 'genre exists');
            assert.strictEqual(typeof json.genre, 'string', 'Field has a correct type');

            assert.ok(json.hasOwnProperty('imgUrl'), 'imgUrl exists');
            assert.strictEqual(typeof json.imgUrl, 'string', 'Field has a correct type');

            assert.ok(json.hasOwnProperty('price'), 'price exists');
            assert.strictEqual(typeof json.price, 'string', 'Field has a correct type');

            assert.ok(json.hasOwnProperty('releaseDate'), 'releaseDate exists');
            assert.strictEqual(typeof json.releaseDate, 'string', 'Field has a correct type');

            assert.ok(json.hasOwnProperty('description'), 'description exists');
            assert.strictEqual(typeof json.description, 'string', 'Field has a correct type');

            assert.ok(json.hasOwnProperty('_createdOn'), '_createdOn exists');
            assert.strictEqual(typeof json._createdOn, 'number', 'Field has a correct type');

            assert.ok(json.hasOwnProperty('_id'), '_id exists');
            assert.strictEqual(typeof json._id, 'string', 'Field has a correct type');
        });
    });

    QUnit.test("Create Album Testing", async (assert) => {
        //arrange
        let path = 'data/albums';
        let random = Math.floor(Math.random() * 10000);

        album.name = `Random album title_${random}`;
        album.description = `Description ${random}`;

        //act
        let response = await fetch(baseUrl + path, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify(album)
        });

        let json = await response.json();

        lastCreatedItemId = json._id;

        //assert
        assert.ok(response.ok, 'Response is OK');

        assert.ok(json.hasOwnProperty('_ownerId'), '_ownerId exists');
        assert.strictEqual(typeof json._ownerId, 'string', 'Field has a correct type');

        assert.ok(json.hasOwnProperty('name'), 'name exists');
        assert.strictEqual(json.name, album.name, 'name as expected');
        assert.strictEqual(typeof json.name, 'string', 'Field has a correct type');

        assert.ok(json.hasOwnProperty('artist'), 'artist exists');
        assert.strictEqual(json.artist, album.artist, 'artist as expected');
        assert.strictEqual(typeof json.artist, 'string', 'Field has a correct type');

        assert.ok(json.hasOwnProperty('genre'), 'genre exists');
        assert.strictEqual(json.genre, album.genre, 'genre as expected');
        assert.strictEqual(typeof json.genre, 'string', 'Field has a correct type');

        assert.ok(json.hasOwnProperty('imgUrl'), 'imgUrl exists');
        assert.strictEqual(json.imgUrl, album.imgUrl, 'imgUrl as expected');
        assert.strictEqual(typeof json.imgUrl, 'string', 'Field has a correct type');

        assert.ok(json.hasOwnProperty('price'), 'price exists');
        assert.strictEqual(json.price, album.price, 'price as expected');
        assert.strictEqual(typeof json.price, 'string', 'Field has a correct type');

        assert.ok(json.hasOwnProperty('releaseDate'), 'releaseDate exists');
        assert.strictEqual(json.releaseDate, album.releaseDate, 'releaseDate as expected');
        assert.strictEqual(typeof json.releaseDate, 'string', 'Field has a correct type');

        assert.ok(json.hasOwnProperty('description'), 'description exists');
        assert.strictEqual(json.description, album.description, 'description as expected');
        assert.strictEqual(typeof json.description, 'string', 'Field has a correct type');

        assert.ok(json.hasOwnProperty('_createdOn'), '_createdOn exists');
        assert.strictEqual(typeof json._createdOn, 'number', 'Field has a correct type');

        assert.ok(json.hasOwnProperty('_id'), '_id exists');
        assert.strictEqual(typeof json._id, 'string', 'Field has a correct type');
    });

    QUnit.test("Edit Album Testing", async (assert) => {
        //arrange
        let path = 'data/albums';
        album.description = "Ultimately Edited Description";

        //act
        let response = await fetch(baseUrl + path + '/' + lastCreatedItemId, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify(album)
        });

        let json = await response.json();

        //assert
        assert.ok(response.ok, 'Response is OK');

        assert.ok(json.hasOwnProperty('_ownerId'), '_ownerId exists');
        assert.strictEqual(typeof json._ownerId, 'string', 'Field has a correct type');

        assert.ok(json.hasOwnProperty('name'), 'name exists');
        assert.strictEqual(json.name, album.name, 'name as expected');
        assert.strictEqual(typeof json.name, 'string', 'Field has a correct type');

        assert.ok(json.hasOwnProperty('artist'), 'artist exists');
        assert.strictEqual(json.artist, album.artist, 'artist as expected');
        assert.strictEqual(typeof json.artist, 'string', 'Field has a correct type');

        assert.ok(json.hasOwnProperty('genre'), 'genre exists');
        assert.strictEqual(json.genre, album.genre, 'genre as expected');
        assert.strictEqual(typeof json.genre, 'string', 'Field has a correct type');

        assert.ok(json.hasOwnProperty('imgUrl'), 'imgUrl exists');
        assert.strictEqual(json.imgUrl, album.imgUrl, 'imgUrl as expected');
        assert.strictEqual(typeof json.imgUrl, 'string', 'Field has a correct type');

        assert.ok(json.hasOwnProperty('price'), 'price exists');
        assert.strictEqual(json.price, album.price, 'price as expected');
        assert.strictEqual(typeof json.price, 'string', 'Field has a correct type');

        assert.ok(json.hasOwnProperty('releaseDate'), 'releaseDate exists');
        assert.strictEqual(json.releaseDate, album.releaseDate, 'releaseDate as expected');
        assert.strictEqual(typeof json.releaseDate, 'string', 'Field has a correct type');

        assert.ok(json.hasOwnProperty('description'), 'Ultimately edited description exists');
        assert.strictEqual(json.description, album.description, 'description as expected');
        assert.strictEqual(typeof json.description, 'string', 'Field has a correct type');

        assert.ok(json.hasOwnProperty('_createdOn'), '_createdOn exists');
        assert.strictEqual(typeof json._createdOn, 'number', 'Field has a correct type');

        assert.ok(json.hasOwnProperty('_id'), '_id exists');
        assert.strictEqual(typeof json._id, 'string', 'Field has a correct type');
    });

    QUnit.test("Delete Album Testing", async (assert) => {
        //arrange
        let path = 'data/albums';

        //act
        let response = await fetch(baseUrl + path + '/' + lastCreatedItemId, {
            method: 'DELETE',
            headers: {
                'X-Authorization': token
            }
        });

        //assert
        assert.ok(response.ok, 'Response is OK');
    });
});

