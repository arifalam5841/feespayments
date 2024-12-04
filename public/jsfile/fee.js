document.addEventListener("DOMContentLoaded", () => {
  const nameForm = document.getElementById("nameForm");
  const feeDetails = document.getElementById("feeDetails");

  const nameInput = document.getElementById("nameInput");
  const errorMessage = document.getElementById("errorMessage");

  const userName = document.getElementById("userName");
  const paidAmount = document.getElementById("paidAmount");
  const toPayAmount = document.getElementById("toPayAmount");

  const payInput = document.getElementById("payInput");
  const successMessage = document.getElementById("successMessage");

  const feechecknameinput = document.getElementById("check-fee-name");
  const feecheckbtn = document.getElementById("check-fee-btn");
  const showfee = document.getElementById("display-fees");
  const feeerror = document.getElementById("feeshowerror");

  document.getElementById("checkNameBtn").addEventListener("click", () => {
    const name = nameInput.value;

    if (!name) {
      errorMessage.textContent = "Please enter a name.";
      errorMessage.style.display = "block";
      return;
    }

    axios
      .post("/check-name", { name })
      .then((response) => {
        if (response.data.success) {
          // this is value of "res.json"
          const user = response.data.user;
          userName.textContent = user.name;
          paidAmount.textContent = user.feespaid;
          //   toPayAmount.textContent = user.toPay;

          nameForm.style.display = "none";
          feeDetails.style.display = "block";
        } else {
          errorMessage.textContent = response.data.message;
          errorMessage.style.display = "block";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        errorMessage.textContent = "An error occurred. Please try again.";
        errorMessage.style.display = "block";
      });
  });

  document.getElementById("payFeesBtn").addEventListener("click", () => {
    const amount = payInput.value.trim();

    if (!amount || isNaN(amount) || parseInt(amount, 10) <= 0) {
      successMessage.textContent = "Please enter a valid amount.";
      successMessage.style.color = "red";
      successMessage.style.display = "block";
      return;
    }

    axios
      .post("/pay-fees", { name: userName.textContent, amount })
      .then((response) => {
        if (response.data.success) {
          const user = response.data.user;
          paidAmount.textContent = user.feespaid;
          //   toPayAmount.textContent = user.toPay;

          successMessage.textContent = "Payment successful!";
          successMessage.style.color = "green";
          successMessage.style.display = "block";
        } else {
          successMessage.textContent = response.data.message;
          successMessage.style.color = "red";
          successMessage.style.display = "block";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        successMessage.textContent = "An error occurred. Please try again.";
        successMessage.style.color = "red";
        successMessage.style.display = "block";
      });
  });

  feecheckbtn.addEventListener("click", () => {
    let name = feechecknameinput.value;

    if (!name) {
      feeerror.textContent = "Please enter a name.";
      feeerror.style.display = "block";
      feeerror.style.color = "red";
      return;
    }

    axios.post("/check-fee", { name }).then((response) => {
      if (response.data.success) {
        showfee.innerHTML = response.data.fees;
        showfee.style.display = "block";
        feeerror.style.display = "none";
      } else {
        feeerror.textContent = response.data.message;
        feeerror.style.display = "block";
      }
    });
  });
});
