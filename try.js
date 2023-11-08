var map = function(arr, fn){
    let newArr = [];
    for(let i = 0; i < arr.length; i++){
        newArr.push(fn(arr[i]));
    }
    return newArr;

}

arr = [1,2,3];