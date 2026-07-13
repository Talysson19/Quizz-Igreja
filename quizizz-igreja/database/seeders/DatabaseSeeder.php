<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Church;
use App\Models\Question;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Criar uma Igreja de Teste
        $church = Church::create([
            'name' => 'Paróquia São José',
            'responsible_name' => 'Coordenador João',
            'manual_path' => null,
            'certificate_enabled' => true,
        ]);

        // 2. Criar um Administrador para a Igreja
        $admin = User::create([
            'church_id' => $church->id,
            'name' => 'Coordenador João',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('Senha123'),
            'role' => 'admin',
            'must_change_password' => false,
        ]);

        // 3. Criar Acólitos de Teste com pontos para o ranking
        $acolyto1 = User::create([
            'church_id' => $church->id,
            'name' => 'Mateus Silva',
            'email' => 'mateus@gmail.com',
            'password' => Hash::make('Senha123'),
            'role' => 'acolyte',
            'points' => 320,
            'streak_count' => 3,
            'has_downloaded_manual' => true,
            'must_change_password' => false,
        ]);

        $acolyto2 = User::create([
            'church_id' => $church->id,
            'name' => 'Lucas Santos',
            'email' => 'lucas@gmail.com',
            'password' => Hash::make('Senha123'),
            'role' => 'acolyte',
            'points' => 160,
            'streak_count' => 1,
            'has_downloaded_manual' => false,
            'must_change_password' => false,
        ]);

        $acolyto3 = User::create([
            'church_id' => $church->id,
            'name' => 'Gabriel Oliveira',
            'email' => 'gabriel@gmail.com',
            'password' => Hash::make('Senha123'),
            'role' => 'acolyte',
            'points' => 60,
            'streak_count' => 0,
            'has_downloaded_manual' => false,
            'must_change_password' => false,
        ]);

        $acolyto4 = User::create([
            'church_id' => $church->id,
            'name' => 'Joana Mendes',
            'email' => 'joana@gmail.com',
            'password' => Hash::make('Senha123'),
            'role' => 'acolyte',
            'points' => 15,
            'streak_count' => 0,
            'has_downloaded_manual' => false,
            'must_change_password' => false,
        ]);

        // 3.1. Cadastrar Manuais de Teste para cada nível
        \App\Models\Manual::create([
            'church_id' => $church->id,
            'display_name' => 'Manual de Fundamentos - Nível 1',
            'file_path' => 'manuals/manual_nivel1.pdf',
            'level' => 1,
        ]);

        \App\Models\Manual::create([
            'church_id' => $church->id,
            'display_name' => 'Manual de Cerimonial - Nível 2',
            'file_path' => 'manuals/manual_nivel2.pdf',
            'level' => 2,
        ]);

        // 4. Cadastrar as perguntas iniciais e associar à Igreja criada
        $questions = [
            [
                'level' => 1,
                'title' => 'Qual é a cor litúrgica usada no Advento e na Quaresma?',
                'option_a' => 'Verde', 'option_b' => 'Branco', 'option_c' => 'Roxo', 'option_d' => 'Vermelho',
                'correct_option' => 'c',
                'hint' => 'É uma cor que convida à penitência e preparação.',
                'explanation' => 'O Roxo simboliza a expectativa e a penitência.',
            ],
            [
                'level' => 1,
                'title' => 'Como se chama o objeto usado para queimar o incenso?',
                'option_a' => 'Cálice', 'option_b' => 'Turíbulo', 'option_c' => 'Patena', 'option_d' => 'Galheta',
                'correct_option' => 'b',
                'hint' => 'Ele é balançado pelo acólito e solta fumaça perfumada.',
                'explanation' => 'O Turíbulo é o vaso onde se queima o incenso sobre brasas.',
            ],
            [
                'level' => 1,
                'title' => 'Qual o nome do prato dourado onde é colocada a hóstia grande?',
                'option_a' => 'Âmbula', 'option_b' => 'Cálice', 'option_c' => 'Patena', 'option_d' => 'Corporal',
                'correct_option' => 'c',
                'hint' => 'É um prato pequeno e raso que acompanha o cálice.',
                'explanation' => 'A Patena é o prato onde se coloca a hóstia que será consagrada.',
            ],
            [
                'level' => 1,
                'title' => 'Como se chama o pequeno sino usado na consagração?',
                'option_a' => 'Matraca', 'option_b' => 'Sineta', 'option_c' => 'Carrilhão', 'option_d' => 'Gongo',
                'correct_option' => 'b',
                'hint' => 'É tocada pelo acólito para chamar a atenção para o milagre da Eucaristia.',
                'explanation' => 'A Sineta é usada para anunciar os momentos solenes da consagração.',
            ],
            [
                'level' => 1,
                'title' => 'Quais são os pequenos vasos que contêm a água e o vinho?',
                'option_a' => 'Âmulas', 'option_b' => 'Cálices', 'option_c' => 'Galhetas', 'option_d' => 'Patenas',
                'correct_option' => 'c',
                'hint' => 'Ficam sobre a credência antes do ofertório.',
                'explanation' => 'As Galhetas são os dois recipientes para a água e o vinho do sacrifício.',
            ],
            [
                'level' => 2,
                'title' => 'Como se chama o pano branco usado para limpar o cálice?',
                'option_a' => 'Corporal', 'option_b' => 'Sanguíneo', 'option_c' => 'Manustérgio', 'option_d' => 'Pala',
                'correct_option' => 'b',
                'hint' => 'O nome lembra o "Sangue" de Cristo que é limpo do cálice.',
                'explanation' => 'O Sanguíneo é o pano retangular usado para purificar o cálice.',
            ],
            [
                'level' => 2,
                'title' => 'Qual o nome do livro que contém as orações da Missa?',
                'option_a' => 'Lecionário', 'option_b' => 'Bíblia', 'option_c' => 'Missal Romano', 'option_d' => 'Evangeliário',
                'correct_option' => 'c',
                'hint' => 'O acólito o segura para o padre na oração da coleta.',
                'explanation' => 'O Missal contém as orações presidenciais e o rito da Missa.',
            ],
            [
                'level' => 2,
                'title' => 'Como se chama a veste branca que o acólito usa por baixo?',
                'option_a' => 'Batina', 'option_b' => 'Sobrepeliz', 'option_c' => 'Alva ou Túnica', 'option_d' => 'Estola',
                'correct_option' => 'c',
                'hint' => 'Simboliza a pureza do batismo.',
                'explanation' => 'A Alva ou Túnica é a veste básica de todos os ministros.',
            ],
        ];

        foreach ($questions as $q) {
            $q['church_id'] = $church->id;
            Question::create($q);
        }

        // 5. Inserir uma resposta de exemplo para o ranking ter dados reais de resposta
        $firstQuestion = Question::where('church_id', $church->id)->first();
        if ($firstQuestion) {
            DB::table('user_answers')->insert([
                'user_id' => $acolyto1->id,
                'question_id' => $firstQuestion->id,
                'is_correct' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
