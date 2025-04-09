<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted' => 'Laukam :attribute ir jābūt apstiprinātam.',
    'accepted_if' => 'Lauks :attribute ir jāakceptē, ja :other ir :value.',
    'active_url' => 'Laukam :attribute ir jābūt derīgam URL.',
    'after' => 'Laukā :attribute ir jābūt datumam pēc :date.',
    'after_or_equal' => 'Laukam :attribute ir jābūt datumam pēc :date vai vienādam ar to.',
    'alpha' => 'Laukā :attribute drīkst būt tikai burti.',
    'alpha_dash' => 'Laukā :attribute drīkst būt tikai burti, cipari, domuzīmes un pasvītras.',
    'alpha_num' => 'Laukā :attribute drīkst būt tikai burti un cipari.',
    'array' => 'Laukam :attribute ir jābūt masīvam.',
    'ascii' => 'Laukā :attribute drīkst būt tikai viena baita burtciparu rakstzīmes un simboli.',
    'before' => 'Laukam :attribute jābūt datumam pirms :date.',
    'before_or_equal' => 'Laukam :attribute ir jābūt datumam pirms :date vai vienādam ar to.',
    'between' => [
        'array' => 'Laukā :attribute ir jābūt no :min un :max vienumiem.',
        'file' => 'Laukam :attribute ir jābūt no :min līdz :max kilobaitiem.',
        'numeric' => 'Laukam :attribute ir jābūt no :min līdz :max.',
        'string' => 'Laukam :attribute ir jābūt no :min līdz :max rakstzīmēm.',
    ],
    'boolean' => 'Laukam :attribute ir jābūt patiesam vai nepatiesam.',
    'can' => 'Laukā :attribute ir neatļauta vērtība.',
    'confirmed' => 'Lauka :attribute apstiprinājums lauks neatbilst.',
    'contains' => 'Laukā :attribute trūkst obligātās vērtība.',
    'current_password' => 'Parole ir nepareiza.',
    'date' => 'Laukam :attribute ir jābūt derīgam datumam.',
    'date_equals' => 'Laukam :attribute ir jābūt datumam, kas vienāds ar :date.',
    'date_format' => 'Laukam :attribute ir jāatbilst formātam :format.',
    'decimal' => 'Laukā :attribute jābūt :decimal decimālzīmēm.',
    'declined' => 'Lauks :attribute ir jānoraida.',
    'declined_if' => 'Lauks :attribute ir jānoraida, ja :other ir :value.',
    'different' => 'Laukam :attribute un :other ir jābūt atšķirīgiem.',
    'digits' => 'Laukā :attribute jābūt :digits cipariem.',
    'digits_between' => 'Laukam :attribute jābūt no :min līdz :max cipariem.',
    'dimensions' => 'Laukā :attribute ir nederīgi attēla izmēri.',
    'distinct' => 'Laukam :attribute ir dublēta vērtība.',
    'doesnt_end_with' => 'Lauks :attribute nedrīkst beigties ar vienu no šiem: :values.',
    'doesnt_start_with' => 'Lauks :attribute nedrīkst sākties ar vienu no šiem: :values.',
    'email' => 'Laukam :attribute ir jābūt derīgai e-pasta adresei.',
    'ends_with' => 'Laukam :attribute jābeidzas ar vienu no šiem: :values.',
    'enum' => 'Atlasītais :attribute nav derīgs.',
    'exists' => 'Atlasītais :attribute nav derīgs.',
    'extensions' => 'Laukam :attribute ir jābūt vienam no šiem paplašinājumiem: :values.',
    'file' => 'Laukam :attribute ir jābūt failam.',
    'filled' => 'Laukam :attribute ir jābūt vērtībai.',
    'gt' => [
        'array' => 'Laukā :attribute ir jābūt vairāk nekā :value vienumiem.',
        'file' => 'Laukam :attribute ir jābūt lielākam par :value kilobaitiem.',
        'numeric' => 'Laukam :attribute ir jābūt lielākam par :value.',
        'string' => 'Laukam :attribute ir jābūt lielākam par :value rakstzīmēm.',
    ],
    'gte' => [
        'array' => 'Laukā :attribute jābūt :value vienumiem vai vairāk.',
        'file' => 'Laukam :attribute ir jābūt lielākam vai vienādam ar :value kilobaiti.',
        'numeric' => 'Laukam :attribute ir jābūt lielākam vai vienādam ar :value.',
        'string' => 'Laukam :attribute ir jābūt lielākam vai vienādam ar :value rakstzīmēm.',
    ],
    'hex_color' => 'Laukam :attribute ir jābūt derīgai heksadecimālajai krāsai.',
    'image' => 'Laukam :attribute ir jābūt attēlam.',
    'in' => 'Atlasītais :attribute nav derīgs.',
    'in_array' => ' Laukam :attribute ir jābūt :other.',
    'integer' => 'Laukam :attribute ir jābūt veselam skaitlim.',
    'ip' => 'Laukam :attribute ir jābūt derīgai IP adresei.',
    'ipv4' => 'Laukam :attribute ir jābūt derīgai IPv4 adresei.',
    'ipv6' => 'Laukam :attribute ir jābūt derīgai IPv6 adresei.',
    'json' => 'Laukam :attribute ir jābūt derīgai JSON virknei.',
    'list' => 'Laukam :attribute ir jābūt sarakstam.',
    'lowercase' => 'Laukam :attribute jābūt ar mazajiem burtiem.',
    'lt' => [
        'array' => 'Laukā :attribute jābūt mazākam par :value vienumus.',
        'file' => 'Laukam :attribute jābūt mazākam par :value kilobaitiem.',
        'numeric' => 'Laukam :attribute ir jābūt mazākam par :value.',
        'string' => 'Laukam :attribute jābūt mazākam par :value rakstzīmēm.',
    ],
    'lte' => [
        'array' => 'Laukā :attribute nedrīkst būt vairāk par :value vienumiem.',
        'file' => 'Laukam :attribute ir jābūt mazākam vai vienādam ar :value kilobaiti.',
        'numeric' => 'Laukam :attribute ir jābūt mazākam vai vienādam ar :value.',
        'string' => 'Laukam :attribute jābūt mazākam vai vienādam ar :value rakstzīmēm.',
    ],
    'mac_address' => ' Laukam :attribute ir jābūt derīgai MAC adresei.',
    'max' => [
        'array' => 'Laukā :attribute nedrīkst būt vairāk par :max vienumiem.',
        'file' => 'Lauks :attribute nedrīkst būt lielāks par :maksimāli kilobaitiem.',
        'numeric' => 'Lauks :attribute nedrīkst būt lielāks par :max.',
        'string' => 'Lauks :attribute nedrīkst būt lielāks par :max rakstzīmēm.',
    ],
    'max_digits' => ':attribute laukā nedrīkst būt vairāk par :max cipariem.',
    'mimes' => 'Laukam :attribute ir jābūt failam, kura tips ir: :values.',
    'mimetypes' => 'Laukam :attribute ir jābūt failam, kura tips ir: :values.',
    'min' => [
        'array' => 'Laukā :attribute jābūt vismaz :min vienumiem.',
        'file' => 'Laukam :attribute ir jābūt vismaz :min kilobaitiem.',
        'numeric' => 'Laukam :attribute jābūt vismaz :min.',
        'string' => 'Laukam :attribute ir jābūt vismaz :min rakstzīmēm.',
    ],
    'min_digits' => ':attribute laukā ir jābūt vismaz :min cipariem.',
    'missing' => 'Jātrūkst laukam :attribute.',
    'missing_if' => 'Jātrūkst laukam :attribute, ja :other ir :value.',
    'missing_unless' => 'Jātrūkst laukam :attribute, ja vien :other nav :value.',
    'missing_with' => 'Jābūt laukam :attribute, ja ir :values.',
    'missing_with_all' => 'Jābūt laukam :attribute, ja ir :values.',
    'multiple_of' => 'Laukam :attribute ir jābūt :value daudzkārtnim.',
    'not_in' => 'Atlasītais :attribute nav derīgs.',
    'not_regex' => 'Lauka :attribute formāts nav derīgs.',
    'numeric' => 'Laukam :attribute jābūt skaitlim.',
    'parole' => [
        'letters' => 'Laukā :attribute ir jābūt vismaz vienam burtam.',
        'mixed' => 'Laukā :attribute ir jābūt vismaz vienam lielajam un vienam mazajam burtam.',
        'numbers' => 'Laukā :attribute ir jābūt vismaz vienam skaitlim.',
        'symbols' => 'Laukā :attribute ir jābūt vismaz vienam simbolam.',
        'uncompromised' => 'Dotais :attribute ir parādījies datu noplūdē. Lūdzu, izvēlieties citu :attribute.',
    ],
    'present' => 'Jābūt laukam :attribute.',
    'present_if' => 'Laukam :attribute ir jābūt klāt, ja :other ir :value.',
    'present_unless' => 'Laukam :attribute ir jābūt, ja vien :other nav :value.',
    'present_with' => 'Laukam :attribute ir jābūt klāt, ja ir :values.',
    'present_with_all' => 'Lai :attribute ir jābūt klāt, ja ir :values.',
    'prohibited' => 'Lauks :attribute ir aizliegts.',
    'prohibited_if' => 'Lauks :attribute ir aizliegts, ja :other ir :value.',
    'prohibited_unless' => 'Lauks :attribute ir aizliegts, ja vien :other nav :values.',
    'prohibits' => 'Lauks :attribute aizliedz :other atrasties.',
    'regex' => ':attribute lauka formāts nav derīgs.',
    'required' => 'Atribūta lauks ir nepieciešams.',
    'required_array_keys' => 'Laukā :attribute ir jābūt ierakstiem: :values.',
    'required_if' => 'Lauls :attribute ir nepieciešams, ja :other ir :value.',
    'required_if_accepted' => 'Lauls :attribute ir nepieciešams, ja tiek pieņemts :other.',
    'required_if_declined' => 'Lauls :attribute ir nepieciešams, ja :other ir noraidīts.',
    'required_unless' => 'Lauls :attribute ir obligāts, ja vien :other nav :values.',
    'required_with' => 'Lauls :attribute ir nepieciešams, ja ir :values.',
    'required_with_all' => 'Lauls :attribute ir nepieciešams, ja ir :values.',
    'required_without' => 'Lauls :attribute ir nepieciešams, ja :values nav.',
    'required_without_all' => 'Lauls :attribute ir nepieciešams, ja nav neviena no :vērtībām.',
    'same' => 'Laukam :attribute ir jāatbilst :other.',
    'izmērs' => [
        'array' => 'Laukā :attribute ir jāietver :size vienumi.',
        'file' => 'Laukam :attribute jābūt :size kilobaitiem.',
        'numeric' => 'Laukam :attribute jābūt :size.',
        'string' => 'Laukam :attribute ir jābūt :size rakstzīmēm.',
    ],
    'starts_with' => 'Laukam :attribute jāsākas ar vienu no šiem: :values.',
    'string' => 'Laukam :attribute ir jābūt virknei.',
    'timezone' => 'Laukam :attribute ir jābūt derīgai laika joslai.',
    'unique' => 'Atribūts :attribute jau ir izmantots.',
    'uploaded' => 'Atribūtu :attribute neizdevās augšupielādēt.',
    'uppercase' => 'Laukam :attribute ir jābūt lielajiem burtiem.',
    'url' => 'Laukam :attribute ir jābūt derīgam URL.',
    'ulid' => 'Laukam :attribute ir jābūt derīgam ULID.',
    'uuid' => 'Laukam :attribute ir jābūt derīgam UUID.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap our attribute placeholder
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email". This simply helps us make our message more expressive.
    |
    */

    'attributes' => [],

];
