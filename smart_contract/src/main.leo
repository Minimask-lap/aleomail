program aleo_voice103.aleo {

    // Struct to track the total number of messages sent from an address
    struct TotalMessage {
        messenger: address,
        total_messages: u64,
    }

    // Mapping for storing the total number of messages sent by each address
    mapping voice_input: address => TotalMessage;

    // Struct for representing a voice message
    record Voice {
        owner: address,
        sent_from: address,
        msg: field,
        date: u128,
    }

    // Struct for representing a voice message
    record Voice2 {
        owner: address,
        sent_to: address,
        msg: field,
        date: u128,
    }



    // Transition for sending a voice note to another user
    async transition send_voice(owner: address, receiver: address, msg: field, date: u128) -> (Voice, Voice2, Future) {

        // Check that the sender is not null and that the receiver is not the sender
        assert_eq(self.caller, owner);
        assert_neq(self.caller, receiver);

        // Create a new Voice record
        let send_from: Voice = Voice {
            owner: receiver,
            sent_from: owner,
            msg: msg,
            date: date,
        };

        //hash the message u64 sent to receiver
        let send_to : Voice2 = Voice2 {
            owner: owner,
            sent_to: receiver,
            msg:  msg, // real msg
            date: date,
        };

        // Finalize sending the voice note
        return (send_from, send_to, finalize_send_voice(owner, receiver));

    }

    // Function to finalize the process of sending a voice note
    async function finalize_send_voice(owner: address, receiver: address) {

        //check if a owner have aleo name service registered
        //let check_ans_owner: field = Mapping::get(aleo_name_service_registry_v4.aleo/primary_names, owner);
        //check if a receiver have aleo name service registered
        //let check_ans_receiver: field = Mapping::get(aleo_name_service_registry_v4.aleo/primary_names, receiver);

        //checking if aleo name service for owner/receiver
        //assert(check_ans_owner == check_ans_owner);
        //assert(check_ans_receiver == check_ans_receiver);

        // Get or create a TotalMessage record for the owner
        let tot_message: TotalMessage = Mapping::get_or_use(voice_input, owner, TotalMessage {
            messenger: owner,
            total_messages: 0u64,
        });

        // Increment the total number of messages sent by the owner
        Mapping::set(voice_input, owner, TotalMessage {
            messenger: owner,
            total_messages: tot_message.total_messages + 1u64,
        });
    }
}
