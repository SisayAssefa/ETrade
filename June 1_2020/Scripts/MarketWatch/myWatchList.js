function Product(name, price) {
    this.name = ko.observable(name);
    this.price = ko.observable(price);

}

function personViewModel() {
    var self = this;
    this.shoppingCart = ko.observableArray([
        //new Product("Beer", 10.99),
        //new Product("Brats", 7.99),
        //new Product("Buns", 1.49)

    ]);

    this.addProduct = function () {
        var serviceUrl = serviceUrlHostName + "Lookup/UIBindingService.svc/GetAllWarehouses";
        var params = {};
        $.ajax({
            type: "post",
            url: serviceUrl,
            data: JSON.stringify(params),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (data) {
                $.each(data.GetAllWarehousesResult, function () {
                    var productItem = new Product(this.Text, this.Value);
                    self.shoppingCart.push(productItem);
                });
            },
            error: function (e) { return false; }
        });
    };

    this.removeProduct = function (product) {
        alert("in")
        //self.shoppingCart.remove(product);
        var serviceUrl = serviceUrlHostName + "Lookup/UIBindingService.svc/GetAllWarehouses";
        var params = {};
        $.ajax({
            type: "post",
            url: serviceUrl,
            data: JSON.stringify(params),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (data) {
                $.each(data.GetAllWarehousesResult, function () {
                    var productItem = new Product(this.Text, this.Value);
                    self.shoppingCart.push(productItem);
                });

            },
            error: function (e) { return false; }
        });
    };

    this.destroyProduct = function (product) {
        self.shoppingCart.destroy(product);
    };

};

var test = function () {
    alert("in")
    //self.shoppingCart.remove(product);
    var serviceUrl = serviceUrlHostName + "Lookup/UIBindingService.svc/GetAllWarehouses";
    var params = {};
    $.ajax({
        type: "post",
        url: serviceUrl,
        data: JSON.stringify(params),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            $.each(data.GetAllWarehousesResult, function () {
                var productItem = new Product(this.Text, this.Value);
                self.shoppingCart.push(productItem);
            });

        },
        error: function (e) { return false; }
    });
};

$(function () {
    ko.applyBindings(new personViewModel(), document.getElementById('xyzx'));
});