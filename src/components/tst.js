<script>
	function cleanU128Private(value) {
    	return value.replace(/u128\.private$/, '');  // Removes the 'u128.private' part
	}

    if (window.leoWallet && window.leoWallet.readyState === "Installed") {
        if (!window.leoWallet.connected) {
            main_connect();
        } else {
            main_connect();
        }
    } else {
        console.log("No wallet installed!");
    }

	//connected to wallet
    async function main_connect() {
	//sign a message
	let utf8Encode = new TextEncoder();
    let bytes = utf8Encode.encode("Welcome to Aleo Simple Messenger, Send message anonymously to another user...");

    window.leoWallet.signMessage(bytes);

    window.leoWallet.connect("ON_CHAIN_HISTORY", "testnetbeta", ["credits.aleo", "aleo_voice101.aleo"]);
	window.leoWallet.requestRecordPlaintexts("aleo_voice101.aleo").then(res => {
    console.log('Fetched Records:', res);

    let tableBody = '';

	let tableBody2 = '';

	var publicKey = window.leoWallet.publicKey; // Replace with the actual public key

    // Check if `res` contains a `records` array
    if (res && Array.isArray(res.records)) {
        // Filter records by `recordName` "Voice"
        const voiceRecords = res.records.filter(record => record.recordName === "Voice2");

		tableBody += `				<thead>
						<tr>
							<th class="table-plus">Sender</th>
							<th>Receiver</th>
							<th>Msg</th>
							<th>Date</th>
							<th class="datatable-nosort">Actions</th>
						</tr>
					</thead>`;

        if (voiceRecords.length > 0) {
            // Loop through each filtered record
            voiceRecords.forEach(record => {
                // Extract fields for each record
                const { sent_to, msg, date, _nonce } = record.data;

				// Clean the `msg` field from the `u128.private` suffix if present
            	const cleanedMsg = cleanU128Private(msg);
				const cleanedReceiver = cleanU128Private(sent_to);
				const cleaneddate = cleanU128Private(date);

                // Create a table row with the extracted data
                tableBody += `
					<tbody>
                    <tr>
                        <td class="table-plus">
                            <div class="name-avatar d-flex align-items-center">
                                <div class="avatar mr-2 flex-shrink-0">
                                    <img src="./anon/anon2.jpeg" class="border-radius-100 shadow" width="40" height="40" alt="">
                                </div>
                                <div class="txt">
                                    <div class="weight-600">${publicKey.substr(0,10) + "..." + publicKey.substr(-6) || 'N/A'}</div>
                                </div>
                            </div>
                        </td>
						<td>${cleanedReceiver.substr(0,10) + "..." + cleanedReceiver.substr(-6) || 'N/A'}</td>
                        <td>${cleanedMsg.slice(0, -13) || 'N/A'}</td>
                        <td><span id="testingtime">${cleaneddate || 'N/A'}</span></td>
                        <td><span class="badge badge-pill" data-bgcolor="#e7ebf5" data-color="#265ed7">finalize</span></td>
                    </tr>
					</tbody>
					`;
            });
        } else {
            tableBody = '<tr><td colspan="4">No records found with the name "Voice"</td></tr>';
        }
    } else {
        tableBody = '<tr><td colspan="4">No records found or data format is incorrect</td></tr>';
    }



	    // Check if `res` contains a `records` array
		if (res && Array.isArray(res.records)) {
        // Filter records by `recordName` "Voice"
        const voiceRecords = res.records.filter(record => record.recordName === "Voice");
		
		tableBody2 += `				<thead>
						<tr>
							<th class="table-plus">Addr</th>
							<th>Msg</th>
							<th>Date</th>
							<th class="datatable-nosort">Actions</th>
						</tr>
					</thead>`;

        if (voiceRecords.length > 0) {
            // Loop through each filtered record
            voiceRecords.forEach(record => {
                // Extract fields for each record
                const { sent_from, msg, date, _nonce } = record.data;

				// Clean the `msg` field from the `u128.private` suffix if present
            	const cleanedMsg2 = cleanU128Private(msg);
				const cleaneddate2 = cleanU128Private(date);

                // Create a table row with the extracted data
                tableBody2 += `
					<tbody>
                    <tr>
                        <td class="table-plus">
                            <div class="name-avatar d-flex align-items-center">
                                <div class="avatar mr-2 flex-shrink-0">
                                    <img src="./anon/anon2.jpeg" class="border-radius-100 shadow" width="40" height="40" alt="">
                                </div>
                                <div class="txt">
                                    <div class="weight-600">${sent_from.substr(0,10) + "..." + sent_from.substr(-6) || 'N/A'}</div>
                                </div>
                            </div>
                        </td>
                        <td>${cleanedMsg2.slice(0, -13) || 'N/A'}</td>
                        <td><span id="testingtime">${cleaneddate2 || 'N/A'}</span></td>
                        <td><span class="badge badge-pill" data-bgcolor="#e7ebf5" data-color="#265ed7">finalize</span></td>
                    </tr>`;
            });
        } else {
            tableBody2 = '<tr><td colspan="4">No records found with the name "Voice"</td></tr>';
        }
    } else {
        tableBody2 = '<tr><td colspan="4">No records found or data format is incorrect</td></tr>';
    }


    // Insert the generated rows into the table body with a specific ID
    document.getElementById("sentMessageTableBody").innerHTML = tableBody;
	document.getElementById("sentMessageTableBody2").innerHTML = tableBody2;

}).catch(err => {
    console.error('Error fetching records:', err);
    document.getElementById("sentMessageTableBody").innerHTML = '<tr><td colspan="4">Failed to retrieve records.</td></tr>';
});

	var publicKey = window.leoWallet.publicKey; // Replace with the actual public key
    var sub_str_wallet = publicKey.substr(0, 10) + "..." + publicKey.substr(-6);

    console.log('Signature: ', bytes);
    document.getElementById('aleoAddress1').innerHTML = '<i class="dw dw-wallet" ></i>' + sub_str_wallet;
    }


	document.addEventListener("DOMContentLoaded", function () {
	const copyAddressBtn = document.getElementById("copyAddressBtn");
	const aleoAddress = document.getElementById("aleoAddress1");
	copyAddressBtn.addEventListener("click", function () {
    const textToCopy = aleoAddress.value;
    navigator.clipboard.writeText(textToCopy);
    alert("Address copied!");
  });
});
</script>