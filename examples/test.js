function b() {
    this.wee = function() {
        print("hi");
        return 6;
    }

    return 1 + 1;
}

function a() {
    try {
        var foo = new b();
        foo.wee();
    } catch(e) {

    }
    return 7;
}

a();
