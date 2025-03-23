const users = []
const userJoin = (id,username,room)=>{
    const user = {id,username,room};
    users.push(user);
    return user;
}

const findUser = (id)=>{
    const user = users.find((user) => user.id === id);
    return user;
}

//user leaves 
const userLeave = (id)=>{
    const index = users.findIndex(user => user.id === id);
    if(index !== -1){
        return users.splice(index,1)[0];
    }
}
//get room users

const getRoomUsers = (room)=>{
    return users.filter(user => user.room === room);
}

module.exports = {findUser,userJoin,userLeave,getRoomUsers};