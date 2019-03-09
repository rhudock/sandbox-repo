var base64 = "ZWqg6AphrMQ+dGHcLDhzoEUIRANLg9v7RmHjUWHoe//yAlWfPT53yczSvilniCERmhYIM2IX5LZbgaqvMKtFo010YqJqzYAEOR78XiG0V9bVRw2eCG5OvbV0/ZflKtj82Rh4ZvRRwSzJa4kQ9T5PhbtfI21p5rh0GFrXl93ngGdbpxKsQ9K8dawmaaRNtyqIZpro1KQBvRUvTPxcaiWMqX2SnvG62ZOT8gqXvSPz3qaBCU8cOA5MawbO1tlVAyn+efJSX4R6qS8ICqfME1Wc7mmFtWDTK9LWZmlrs+BGqXWBr87EndKsfR++n45KAJynjDi8X7ub2KlVH62rUm8Fow=="
console.log(base64);


var decode = new Buffer(base64, 'base64');
console.log(decode);

var encode = new Buffer(decode, 'binary').toString('base64');
console.log(encode);