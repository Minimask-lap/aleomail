program aleo_voice123.aleo;

struct TotalMessage:
    messenger as address;
    total_messages as u64;

record Voice:
    owner as address.private;
    sent_from as address.private;
    msg as field.private;
    hash_msg as u128.private;
    date as u128.private;

record Voice2:
    owner as address.private;
    sent_to as address.private;
    msg as field.private;
    hash_msg as u128.private;
    date as u128.private;


mapping voice_input:
	key as field.public;
	value as TotalMessage.public;


mapping nick_name:
	key as address.public;
	value as field.public;


function set_nickname:
    input r0 as field.private;
    async set_nickname self.caller r0 into r1;
    output r1 as aleo_voice123.aleo/set_nickname.future;

finalize set_nickname:
    input r0 as address.public;
    input r1 as field.public;
    set r1 into nick_name[r0];




function send_voice:
    input r0 as address.private;
    input r1 as address.private;
    input r2 as u128.private;
    input r3 as u128.private;
    cast r2 into r4 as field;
    hash.bhp256 r4 into r5 as u128;
    assert.eq self.caller r0;
    assert.neq self.caller r1;
    cast r2 into r6 as field;
    cast r1 r0 r6 r5 r3 into r7 as Voice.record;
    cast r2 into r8 as field;
    cast r0 r1 r8 r5 r3 into r9 as Voice2.record;
    async send_voice r0 r1 into r10;
    output r7 as Voice.record;
    output r9 as Voice2.record;
    output r10 as aleo_voice123.aleo/send_voice.future;

finalize send_voice:
    input r0 as address.public;
    input r1 as address.public;
    hash.keccak512 r0 into r2 as field;
    cast r0 0u64 into r3 as TotalMessage;
    get.or_use voice_input[r2] r3 into r4;
    add r4.total_messages 1u64 into r5;
    cast r0 r5 into r6 as TotalMessage;
    set r6 into voice_input[r2];

