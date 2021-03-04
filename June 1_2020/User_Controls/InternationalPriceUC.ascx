<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="InternationalPriceUC.ascx.cs" Inherits="TraderUI.User_Controls.InternationalPriceUC" %>
<style>
    .priceUp {
        color:yellowgreen;
    }
    .priceDown {
        color:#fe6565;
    }
    .PriceEqual {
        color:#d3fc00;
    }

</style>
<marquee>
      <span id="spanPriceTicker" ></span>
</marquee>
<script src="Scripts/InternationalPrice.js"></script>

