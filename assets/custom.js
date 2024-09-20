document.addEventListener("DOMContentLoaded", function () {
  let selectedVariantId = null;
  let selectedSellingPlan = null;
  let selectedProductType = null;

  const preSelectedBundle = document.querySelector(
    'input[name="bundlePkg"]:checked'
  );
  const preSelectedPurchase = document.querySelector(
    'input[name="bundlePurchase"]:checked'
  );

  if (preSelectedBundle) {
    selectedVariantId = preSelectedBundle.getAttribute("data-variant-id");
    selectedSellingPlan = preSelectedBundle.getAttribute("data-selling-plan");
    preSelectedBundle
      .closest(".bs-devshop--bundle-box")
      .classList.add("bs-devshop--active-bundle-box");
  }

  if (preSelectedPurchase) {
    selectedProductType = preSelectedPurchase.getAttribute("data-product-type");
    preSelectedPurchase
      .closest(".bs-devshop--purchase-option")
      .classList.add("bs-devshop--active-purchase-option");
  }

  function updateCheckedState(
    radioGroup,
    selectedRadio,
    activeClass,
    boxClass
  ) {
    radioGroup.forEach((radio) => {
      radio.removeAttribute("checked");
      radio.checked = false;
      radio.closest(`.${boxClass}`).classList.remove(activeClass);
    });

    selectedRadio.setAttribute("checked", "checked");
    selectedRadio.checked = true;
    selectedRadio.closest(`.${boxClass}`).classList.add(activeClass);
    document.querySelector('.bs-devshop--graidet-text').classList.add('visibility-hidden');  
    if (selectedRadio.closest(`.${boxClass}`).classList.contains('bs-devshop--most-popular')) {
      document.querySelector('.bs-devshop--graidet-text').classList.remove('visibility-hidden');
    }
  }

  const bundleRadios = document.querySelectorAll('input[name="bundlePkg"]');
  bundleRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      if (this.checked) {
        updateCheckedState(
          bundleRadios,
          this,
          "bs-devshop--active-bundle-box",
          "bs-devshop--bundle-box"
        );        
        selectedVariantId = this.getAttribute("data-variant-id");
        selectedSellingPlan = this.getAttribute("data-selling-plan");
        let text = this.getAttribute("data-variant-text");
        let element = document.querySelector(`[data-value-text="${text}"]`);
        if (element) {
            element.click();
        } else {
            console.error('Element not found');
        }
      }
    });
  });

  const purchaseRadios = document.querySelectorAll(
    'input[name="bundlePurchase"]'
  );
  purchaseRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      if (this.checked) {
        updateCheckedState(
          purchaseRadios,
          this,
          "bs-devshop--active-purchase-option",
          "bs-devshop--purchase-option"
        );
        selectedProductType = this.getAttribute("data-product-type");
        if (selectedProductType === "one-time") {
          selectedSellingPlan = null;
          document.querySelector('.rc-widget #rc-radio1').click();
        } else {
          const activeBundle = document.querySelector(
            'input[name="bundlePkg"]:checked'
          );
          selectedSellingPlan = activeBundle
            ? activeBundle.getAttribute("data-selling-plan")
            : null;
          document.querySelector('.rc-widget #rc-radio2').click();
        }
      }
    });
  });

  const checkoutButton = document.querySelector(".bs-devshop--cart-btn");
  checkoutButton.addEventListener("click", function () {
    if (selectedVariantId && selectedProductType) {
      addToCart(selectedVariantId, selectedSellingPlan, selectedProductType);
    } else {
      alert("Please select a bundle and purchase option.");
    }
  });

  function addToCart(variantId, sellingPlanId, productType) {
    const payload = {
      id: variantId,
      quantity: 1,
    };

    if (sellingPlanId && productType !== "one-time") {
      payload.selling_plan = sellingPlanId;
    }

    fetch("/cart/add.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        location.href = "/checkout";
      })
      .catch((error) => console.error("Error adding to cart:", error));
  }
});
