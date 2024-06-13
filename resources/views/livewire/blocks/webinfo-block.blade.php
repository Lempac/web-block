<div class="shadow rounded-lg p-2 bg-gray-800 ">
    <table class="font-normal text-gray-400 table border-separate border-spacing-2">
        <tr class="bg-gray-700">
            <th>ID</th>
            <th>Email</th>
            <th>Is Admin</th>
            <th>Github Name</th>
            <th>Created At</th>
            <th>Updated At</th>
        </tr>
        @foreach($users as $user)
        <tr wire:key="{{ $user->id }}" class="bg-gray-700">
            <td class="text-center">{{ $user->id }}</td>
            <td>{{ $user->email }}</td>
            <td class="text-center"><input type="checkbox" class="hover:accent-gray-700 border-4 border-gray-700 accent-gray-800" @checked($user->is_admin) @click="$wire.toggleAdmin({{$user->id}}); $wire.$parent.$parent.$refresh()"></td>
            <td>{{ $user->github_name ?? "Null" }}</td>
            <td>{{ $user->created_at }}</td>
            <td>{{ $user->updated_at }}</td>
        </tr>
        @endforeach
    </table>
</div>
