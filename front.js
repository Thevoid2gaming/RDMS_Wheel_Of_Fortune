const fs = require('fs');
const path = require('path');
    try{
        const filePath = path.join(__dirname, 'front.json');
        const rawData = fs.readFileSync(filePath, 'utf8');
        const choiceInfo = JSON.parse(rawData);
        let keys = Object.keys(choiceInfo);
        let random_celeb = Math.floor(Math.random() * choiceInfo.Celebrities.length) ;
        let random_movie = Math.floor(Math.random() * choiceInfo.Movies.length); 
        let random_landmark = Math.floor(Math.random() * choiceInfo.Landmarks.length) ;
        let random_compsci = Math.floor(Math.random() * choiceInfo.CompSci.length); 
        let random_topic = Math.floor(Math.random() * keys.length);
        let chosen_topic = keys[random_topic];
        let word;
        console.log(`Celebrities:\n${choiceInfo.Celebrities.join("\n")}`);
        console.log(`Random Celebrity:\n${choiceInfo.Celebrities[random_celeb]}`);
        console.log(`Random Movie:\n${choiceInfo.Movies[random_movie]}`);
        console.log(`Random Landmark:\n${choiceInfo.Landmarks[random_landmark]}`);
        console.log(`Random Compsci topic:\n${choiceInfo.CompSci[random_compsci]}`);
        console.log(`Selected topic:\n${String(chosen_topic)}`);
            if(chosen_topic == "CompSci"){
                word = choiceInfo.CompSci[random_compsci]
                console.log(`Your word to guess is:\n${word}`);
            } else if (chosen_topic == "Movies"){
                word = choiceInfo.Movies[random_movie]
                console.log(`Your word to guess is:\n${word}`);
            } else if (chosen_topic == "Celebrities"){
                word = choiceInfo.Celebrities[random_celeb]
                console.log(`Your word to guess is:\n${choiceInfo.Celebrities[random_celeb]}`);
            } else {
                word = choiceInfo.Landmarks[random_landmark]
                console.log(`Your word to guess is:\n${word}`);
            }
    } catch (error){
        console.error("Couldn't load information");
}
/*let money = [];
let points = [];
let player1 
let player2 
let player3
let player4 


let message = prompt("pick a number between 1 and 10")*/
