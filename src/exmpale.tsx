const $t = (text: string, vars?: any): any[] => [text, vars]

function f (name: string): any {
  console.log($t('文本 function tsx'))

  return (
    <div title={$t('文本 {name} props tsx', {
      name
    })}>
      <h2>
        {$t('文本 children tsx')}
      </h2>
    </div>
  )
}

console.log(f('Test'))
