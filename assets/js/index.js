$(function() {
    
    window.onbeforeunload = function(){
        return 'Are you sure you want to leave?';
    };

    var datafoods = ['Tahu Goreng','Tempe Goreng','Kerupuk','Rujak','Ikan Goreng','Telur Goreng','Telur Rebus','Ayam Goreng','Ayam Bakar','Cumi Bakar','Cumi Tepung','Cah Kankung'];
    var datacart = [];
    
    var template = "";
    for (let is = 0; is < datafoods.length; is++) {
        template +='<a href="javascript:void(0);" class="col-3 box-food" data-value="'+(is+1)+'-'+datafoods[is]+'-'+(is+2)+'000" title="'+datafoods[is]+'"><div class="card">';
        template += '<img class="card-img-top" src="./assets/img/no_image.jpg" alt="Card image cap">';
        template += '<div class="card-body"><p class="card-text">'+datafoods[is]+'</p></div></div></a>';
    }
    $('.list-food').html(template);

    $('.box-food').click(function(){
        var datachoose = $(this).data('value'),
            choosesplit = datachoose.split("-");
        var id = choosesplit[0];
        var name = choosesplit[1];
        var price = choosesplit[2];
        var resultObject = search(id, datacart);
        if(resultObject){
            datacart.find(v => v.id == id).qty = resultObject.qty+1;
        }else{
            datacart.push({'id' : id, 'name' : name, 'qty' : 1 , 'price' : price});
        }
        renderCart();
        
    });
    function search(nameKey, myArray){
        for (var i=0; i < myArray.length; i++) {
            if (myArray[i].id === nameKey) {
                return myArray[i];
            }
        }
    }
    function renderCart(){
        var html = "";
        var subtotal = 0;
        var total = 0;
        for (var i=0; i < datacart.length; i++) {
            var qtys = "<td></td>";
            if(datacart[i].qty > 1){
                var qtys = "<td>x"+datacart[i].qty+"</td>";
            }
            html += "<tr><td>"+datacart[i].name+"</td>"+qtys+"<td>Rp "+convertrupiah(datacart[i].price * datacart[i].qty)+"</td></tr>";
            subtotal = subtotal + (datacart[i].price * datacart[i].qty);
            total = total + (datacart[i].price * datacart[i].qty);
        }
        html += "<tr><td>Sub Total : </td><td></td><td>Rp "+convertrupiah(subtotal)+"</td></tr><tr><td>Total : </td><td></td><td>Rp "+convertrupiah(total)+"</td></tr>";
        $('#detail-print').html(html);
        $('#charge-total').html(convertrupiah(total));
        $('#detail-cart').html(html);
    }
    $('.clear-sale').click(function(){
        if(datacart.length>0){
            datacart = [];
            subtotal = 0;
            total = 0;
            $('#charge-total').html('0');
            var html = "<tr><td>Sub Total : </td><td></td><td>Rp 0</td></tr><tr><td>Total : </td><td></td><td>Rp 0</td></tr>";
            $('#detail-cart').html(html);
            $('#detail-print').html('');
        }else{
            alert('Already clear');
        }
    })
    $('.save').click(function(){
        if(datacart.length>0){
            alert('Bill data has been saved');
            datacart = [];
            subtotal = 0;
            total = 0;
            $('#charge-total').html('0');
            var html = "<tr><td>Sub Total : </td><td></td><td>Rp 0</td></tr><tr><td>Total : </td><td></td><td>Rp 0</td></tr>";
            $('#detail-cart').html(html);
        }else{
            alert('No bill data to be save');
        }
    })
    $('.print').click(function(){
        if(datacart.length>0){
            var subtotal = 0;
            var total = 0;
            var html = "";
            for (var i=0; i < datacart.length; i++) {
                var qtys = "<td></td>";
                if(datacart[i].qty > 1){
                    var qtys = "<td>x"+datacart[i].qty+"</td>";
                }
                html += "<tr><td>"+datacart[i].name+"</td>"+qtys+"<td>Rp "+convertrupiah(datacart[i].price * datacart[i].qty)+"</td></tr>";
                subtotal = subtotal + (datacart[i].price * datacart[i].qty);
                total = total + (datacart[i].price * datacart[i].qty);
            }
            var tfoot = "<tr><th>Sub Total : </th><td></td><td>Rp "+convertrupiah(subtotal)+"</td></tr><tr><th>Total : </th><td></td><td>Rp "+convertrupiah(total)+"</td></tr>";
            $('#detail-print').html(html);
            $('#detail-print2').html(tfoot);
            w=window.open();
            w.document.write($('.to-print').html());
            w.print();
            w.close();
        }else{
            alert('Nothing to print');
        }
    })
    $('.charge').click(function(){
        if(datacart.length>0){
            $('#modal-charge').modal('show');
        }else{
            alert('Nothing to charge');
        }
    })
    $('.calculate').keyup(function(){
        var total = 0;
        for (var i=0; i < datacart.length; i++) {
            total = total + (datacart[i].price * datacart[i].qty);
        }
        var money = $(this).val();            
        $('.refunded').val(convertrupiah(money-total));
    })

    function convertrupiah(num){

        var	number_string = num.toString(),
            sisa 	= number_string.length % 3,
            rupiah 	= number_string.substr(0, sisa),
            ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
                
        if (ribuan) {
            separator = sisa ? '.' : '';
            rupiah += separator + ribuan.join('.');
        }
        return rupiah;   
    }
})