import { ethers } from "hardhat"
import { assert, expect } from "chai"
import { SimpleStorage, SimpleStorage__factory } from "../typechain-types"

describe("SimpleStorage", () => {
    let simpleStorage: SimpleStorage
    let SimpleStorageFactory: SimpleStorage__factory

    beforeEach(async () => {
        SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
        simpleStorage = await SimpleStorageFactory.deploy();
    })

    it("Should start with a favorite number 0", async () => {
        const currentValue = await simpleStorage.retrieve()
        const expectedValue = "0"
        assert.equal(currentValue.toString(), expectedValue)
    })

    it("Should update the favorite number when we call store function", async () => {
        const expectedValue = "8";
        const transactionResponse = await simpleStorage.store(expectedValue);
        await transactionResponse.wait(1);
        const currentValue = await simpleStorage.retrieve();
        assert.equal(currentValue.toString(), expectedValue);
    })

    it("Should add the person in struct people with it's favorite number", async () => {
        const addPersonFavoriteNumber = "21"
        const addPersonFavoriteName = "Any"

        await simpleStorage.addPerson(addPersonFavoriteName, addPersonFavoriteNumber)

        const storedFavoriteNumber = await simpleStorage.nameToFavoriteNumber(addPersonFavoriteName)
        assert.equal(storedFavoriteNumber.toString(), addPersonFavoriteNumber)

        const peopleStructLength = await simpleStorage.people.length
        assert.equal(peopleStructLength, 0)

        const person = await simpleStorage.people(0);
        expect(person.favoriteNumber.toString()).to.equal(addPersonFavoriteNumber);
        expect(person.name).to.equal(addPersonFavoriteName);

    })
})