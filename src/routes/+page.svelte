<form method="POST">
    <label for="name">Name</label>
    <input type="text" name="name" id="">
    <label for="mpesa_number">
        Mpesa Number{" "}
      </label>
    <input type="text" name="mpesa_number" id="">
    <label for="amount">
        {" "}
        Amount{" "}
      </label>
    <input type="number" name="amount" id="">
    <button
        type="submit"
    >
        Proceed With payment
    </button>
</form>

<style>
    form {
        display: grid;
        gap: 10px;
        width: 50%;
        max-width: fit-content;
        height: auto;
        
    }
    button {
        margin-top: auto;
    }
</style>